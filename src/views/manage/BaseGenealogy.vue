<template>  
    <div class="wrap">
        <!-- 侧边栏 -->
        <Sidebar />
        <div class="content">
            <!-- 导航 -->
            <NavModal title="家谱总目录" />
            <!-- 检索模块 -->
            <SearchModal v-show="!isFull" :fieldFilters="fieldFilters" v-on:get-genealogy="getGenealogy" v-on:change-parameters="changeParameters" />
            <div v-show="!isFull" class="btn_wrap_left">
                <input v-if="this.role >=1 && this.role <= 2" class="root" type="button" value="前台公开" @click="openRootModal" />
                <!-- <input v-if="stationKey == '1379194999'" class="swap" type="button" value="家谱分发" @click="openSiteModal(false)" />
                <input v-if="stationKey == '1379194999'" class="swap" type="button" value="全部分发" @click="openSiteModal(true)" />
                <input v-else v-show="stationKey != '1528234980'" class="swap" type="button" value="交换家谱" @click="openSwapModal" /> -->
                <el-button size="small" type="primary" v-if="this.role >=1 && this.role <= 2" @click="downloadExcel">下载检索结果</el-button>
                <!-- <LinkView v-if="stationKey != '1379194999'" class="marginLeft20" /> -->
                <!-- v-show="stationKey != '1528234980'" -->
                <!-- <el-button v-if="this.role >=1 && this.role <= 2"  class="marginLeft20" size="small" type="primary" @click="isEdit = true">编辑的家谱</el-button> -->
                <!-- 全部完结 -->
                <!-- || (orgAdmin == 'admin') -->
                <el-button size="small" type="primary" v-if="['9071165200', '9071165268', '9138241997'].indexOf(roleKey) > -1" @click="handleCompleteCatalog('all')">全部完结</el-button>
                <!-- 批量完结 -->
                <!-- || (orgAdmin == 'admin') -->
                <el-button size="small" type="primary" v-if="['9071165200', '9071165268', '9138241997'].indexOf(roleKey) > -1" @click="handleCompleteCatalog('some')">批量完结</el-button>
                <!-- <el-button size="small" type="primary" @click="handleSearchImages">影像统计</el-button> -->
            </div>
            <!-- 家谱table -->
            <GenealogyTableModal :total="total" :list="list" v-on:toggle-full="toggleFull" v-on:checkbox-change="checkboxChange" v-on:get-genealogy="getJiapuList" />
            <footer class="foot-wrap">
                <div class="left">{{imageTotal ? '共'+imageTotal+'页影像' : ''}}</div>
                <vxe-pager
                    align="center"
                    @page-change = "changePage"
                    :current-page.sync="page"
                    :page-size.sync="limit"
                    :total="total"
                    :layouts="['PrevJump', 'PrevPage', 'JumpNumber','NextPage', 'NextJump', 'FullJump', 'Total']">
                </vxe-pager>
            </footer>
        </div>
        <!-- 分级公开 -->
        <RootModal v-if="isRootShow" :checkList="checkList" :siteKey="stationKey" v-on:close-root="isRootShow=false" v-on:save-root="saveRoot" />
        <!-- 家谱分发 -->
        <SitePerspectiveModal v-if="isSitePerspective" :checkList="checkList" v-on:close-site="isSitePerspective=false" />
        <!-- 家谱交换 -->
        <SwapModal v-if="isSwapModal" :checkList="checkList" v-on:close-site="isSwapModal=false" />
        <!-- 编辑的家谱 -->
        <EditGenealogyListModal v-if="isEdit" v-on:close-edit-list="isEdit = false" :fieldFilters="fieldFilters" />
        <!-- loading -->
        <Loading v-show="loading" />
        <div class="process-wrap" v-if="bindPage && bindPage < bindTotal">
            <el-button class="reconnect" type="primary" @click="reconnect">重新连接</el-button>
            <el-progress type="circle" :percentage="Number((100*bindPage/bindTotal).toFixed(2))"></el-progress>
        </div>
        <!-- 完结谱目错误列表 -->
        <CatalogPassWarn v-if="isWarn" :list="warnList" v-on:close="isWarn = false" />
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import Sidebar from "../../components/sidebar/Sidebar.vue";
import NavModal from "../../components/dictionary/NavModal.vue";
import SearchModal from "../../components/myGenealogy/SearchModal.vue";
import GenealogyTableModal from "../../components/myGenealogy/GenealogyTableModal.vue";
import RootModal from "../../components/myGenealogy/RootModal.vue";
import SwapModal from "../../components/myGenealogy/SwapModal.vue";
import SitePerspectiveModal from "../../components/myGenealogy/SitePerspectiveModal.vue";
import LinkView from "../../components/myGenealogy/LinkView.vue";
import EditGenealogyListModal from "../../components/myGenealogy/EditGenealogyListModal.vue";
import CatalogPassWarn from '../../components/myGenealogy/CatalogPassWarn.vue';
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "baseGenealogy",
    components: {
        Sidebar,NavModal,SearchModal,GenealogyTableModal,RootModal,SwapModal,SitePerspectiveModal,LinkView,EditGenealogyListModal,
        CatalogPassWarn, 
    },
    data: () => {
        return {
            keyWordObj: '',
            libKey: '',
            equal: 1,
            orgKey: '',
            createOrgKey: '',
            prop: '',
            order: '',
            page: 1,
            limit: 20,
            list:[],
            total:0,
            fieldFilters:[],
            loading: false,
            isRootShow:false,
            checkList:[],
            isSwapModal:false,
            isSitePerspective:false,
            begYear: '',
            endYear: '',
            noPublishAD: '',
            isEdit: false,
            startTime: '',
            endTime: '',
            fileName: '',
            keyWord: '',
            isPublish: '',
            isPlace: '',
            condition: '',
            FileStartTimes: '',
            FileEndTimes: '',
            publishStartTime: '',
            publishEndTime: '',
            claimStartTime: '',
            claimEndTime: '',
            isFull: false,
            gcStatus: '',
            NoIndex: '',
            waitComplete: '',
            warnList: [],
            isWarn: false,
            type: '家谱',
            imageTotal: 0,
            GCOver: '',
            country: '中国',
        };
    },
    created:function(){
        this.getOrgInfo();
    },
    mounted:function(){
        this.getFieldFilterList();
        // this.$socket.emit("login",{'userKey':this.userId,'siteKey':this.stationKey, 'role': this.role});
    },
    methods:{
        toggleFull(data){
            this.isFull = data;
        },
        reconnect(){
            this.$socket.emit("login",{'userKey':this.userId,'siteKey':this.stationKey, 'role': this.role});
        },
        async getOrgInfo(){
            let data = await api.getAxios('org/member/info?siteKey='+this.stationKey+'&userKey='+this.userId);
            if(data.status == 200){
                this.$store.dispatch('setPropertyValue',{'property':'orgAdmin','value': data.data.role || ''});
                window.localStorage.setItem('orgAdmin',data.data.role || '');
                this.$store.dispatch('setPropertyValue',{'property':'orgId','value': data.data.orgKey || ''});
                window.localStorage.setItem('orgId',data.data.orgKey || '');
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        checkboxChange(data){// 复选框切换回调
            console.log(data);
            this.checkList = data;
        },
        saveRoot(){//分级公开
            this.isRootShow = false;
            this.getJiapuList();
        },
        changePage({currentPage}){// 页码切换回调
            this.page = currentPage;
            this.getJiapuList();
        },
        async downloadExcel(){// 下载检索结果
            this.loading = true;
            let data = await api.postAxios('data/download',{
                'siteKey': this.stationKey,
                'userKey': this.userId,
                'claimStartTime': (this.claimStartTime ? new Date(this.claimStartTime).getTime() : ''),
                'claimEndTime': (this.claimEndTime ? new Date(this.claimEndTime).getTime() : ''),
                'startFileTimes': (this.FileStartTimes ? new Date(this.FileStartTimes).getTime() : ''),
                'endFileTimes': (this.FileEndTimes ? new Date(this.FileEndTimes).getTime() : ''),
                'publishStartTime': this.publishStartTime ? new Date(this.publishStartTime).getFullYear() : '',
                'publishEndTime': this.publishEndTime ? new Date(this.publishEndTime).getFullYear() : '',
                'condition': this.condition.join(','),
                'isPublish': this.isPublish,
                'isPlace': this.isPlace,
                'noPublishAD': this.noPublishAD,
                'NoIndex': this.noPublishAD,
                'fileName': this.fileName,
                'keyWord': this.keyWord,
                'startTime': this.startTime,
                'endTime': this.endTime,
                'begYear': this.begYear,
                'endYear': this.endYear,
                'libKey': this.libKey,
                'type': this.type,
                'claimOrgKey': (this.orgKey).join(','),
                'orgKey': (this.createOrgKey).join(','),
                'equal': this.equal,
                'gcStatus': this.gcStatus,
                'waitComplete': this.waitComplete,
                'keyWordObj': this.keyWordObj,
                'prop': this.prop,
                'order': this.order,
                'limit': 5000,
                'GCOver': this.GCOver,
                'country': this.country,
            });
            this.loading = false;
            if(data.status == 200){
                ADS.downliadLink(data.result);
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        async getJiapuList(O){// 谱目列表
            console.log(O);
            if(O){
                this.prop = O.prop;
                this.order = O.order;
            }
            this.loading = true;
            let data = await api.getAxios('catalog/back?siteKey='+this.stationKey+
            '&claimStartTime='+(this.claimStartTime ? new Date(this.claimStartTime).getTime() : '')+
            '&claimEndTime='+(this.claimEndTime ? new Date(this.claimEndTime).getTime() + 24*60*60*1000 - 1 : '')+
            '&startFileTimes='+(this.FileStartTimes ? new Date(this.FileStartTimes).getTime() : '')+
            '&endFileTimes='+(this.FileEndTimes ? new Date(this.FileEndTimes).getTime() + 24*60*60*1000 - 1 : '')+
            '&publishStartTime='+ (this.publishStartTime ? new Date(this.publishStartTime).getFullYear() : '')+
            '&publishEndTime='+ (this.publishEndTime ? new Date(this.publishEndTime).getFullYear() : '')+
            '&condition='+this.condition+
            '&isPublish='+this.isPublish+
            '&userKey='+this.userId+
            '&isPlace='+this.isPlace+
            '&noPublishAD='+this.noPublishAD+
            '&NoIndex='+this.NoIndex+
            '&fileName='+this.fileName+
            '&keyWord='+this.keyWord+
            '&startTime='+this.startTime+
            '&endTime='+(this.endTime ? this.endTime + 24*60*60*1000 - 1 : this.endTime)+
            '&begYear='+this.begYear+
            '&endYear='+this.endYear+
            '&libKey='+this.libKey+
            '&orgKey='+this.createOrgKey+
            '&claimOrgKey='+ this.orgKey+
            '&equal='+this.equal+
            '&type='+this.type+
            '&gcStatus='+this.gcStatus+
            '&waitComplete='+this.waitComplete +
            '&keyWordObj='+JSON.stringify(this.keyWordObj)+
            '&prop='+this.prop+
            '&GCOver='+this.GCOver+
            '&country='+this.country+
            '&order='+this.order+'&page='+this.page+'&limit='+this.limit);
            this.loading = false;
            if(data.status == 200){
                this.list = data.result.list;
                this.imageTotal = data.result.imageNumber;
                this.list.map((item)=>{
                    if(this.role >= 1 && this.role <= 3){

                    }else{
                        if(this.orgId == item.claimOrgKey){

                        }else{
                            item.isPassHide = 1;
                        }
                    }
                    
                    item.GCOverO = item.GCOver == 1 ? '已完结' : '未完结';
                    item.gcStatusO = this.catalogStatusO[item.gcStatus] || '';
                    item.NoIndexO = item.NoIndex == 1 ? '不可索引' : '可索引';
                    item.claimTimeO = item.claimTime ? ADS.getLocalTime(item.claimTime, '/', 1) : '';
                    item.createTime = item.createTime ? ADS.getLocalTime(item.createTime, '/', 1) : '';
                    // item.Filetimes = ADS.getLocalTime(item.createTime, '/', 1) || item.Filetimes;
                    item.Filetimes = ADS.getLocalTime(item.Filetimes, '/', 1);
                    item.address = (item.prov || '') + ' ' + (item.city || '') + ' ' + (item.district || '');
                    item.hasImageO = item.hasImage == 1 ? '有' : '无';
                    item.libsStr = item.libs.join(',');
                    item.takeStatus = item.takeStatus == 7 ? '已拍完' : item.takeStatus == 1 ? '已认领' : '未认领';
                    item.indexAssignO = item.indexAssign ? '已分配' : '未分配';
                });
                this.total = data.result.total;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        getFieldFilterList:async function(){// 检索字段列表
            let data=await api.getAxios('field/filter?type=家谱&asSearch=1');
            if(data.status == 200){
                let fieldFilters = [];
                data.data.map((item)=>{fieldFilters.push({'label':item.fieldMeans,'value':item.fieldName})});
                this.fieldFilters = fieldFilters;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        getGenealogy(data){// 检索家谱
            let keyWordObj = {};
            this.libKey = data['libKey'];
            this.equal = data['equal'];
            this.orgKey = data['orgKey'];
            this.createOrgKey = data['createOrgKey'];
            this.begYear = data['begYear'] || '';
            this.endYear = data['endYear'] || '';
            this.noPublishAD = data['noPublishAD'] ? 1 : '';
            this.startTime = data['startTime'] || '';
            this.endTime = data['endTime'] || '';
            this.fileName = data['fileName'] || '';
            this.keyWord = data['keyWord'] || '';
            this.isPublish = data['isPublish'] ? 1 : '';
            this.NoIndex = data['NoIndex'];
            this.isPlace = data['isPlace'] ? 1 : '';
            this.condition = data['condition'] || '';
            this.FileStartTimes = data['FileStartTimes'] || '';
            this.FileEndTimes = data['FileEndTimes'] || '';
            this.publishStartTime = data['publishStartTime'] || '';
            this.publishEndTime = data['publishEndTime'] || '';
            this.gcStatus = data['gcStatus'] || '';
            this.waitComplete = data['waitComplete'] ? data['waitComplete'] : '';
            this.claimStartTime = data['claimStartTime'] || '';
            this.claimEndTime = data['claimEndTime'] || '';
            this.type = data['type'] || '';
            this.GCOver = data['GCOver'] || '';
            this.country = data['country'] || '';

            for(let key in data){
                if(key == 'country' || key == 'publishStartTime' || key == 'publishEndTime' || key == 'GCOver' || key == 'type' || key == 'claimStartTime' || key == 'createOrgKey' || key == 'claimEndTime' || key == 'waitComplete' || key == 'gcStatus' || key == 'FileStartTimes' || key == 'FileEndTimes' || key == 'condition' || key == 'NoIndex' || key == 'isPublish' || key == 'isPlace' || key == 'fileName' || key == 'keyWord' || key == 'startTime' || key == 'endTime' || key == 'libKey' || key == 'equal' || key == 'orgKey' || key == 'begYear' || key == 'endYear' || key == 'noPublishAD'){

                }else{
                    keyWordObj[key] = data[key];
                }
            }
            this.keyWordObj = keyWordObj;

            this.page = 1;
            
            this.getJiapuList();
        },
        handleSearchImages(){
            this.getJiapuList();
        },
        changeParameters(data){
            let keyWordObj = {};
            this.libKey = data['libKey'];
            this.equal = data['equal'];
            this.orgKey = data['orgKey'];
            this.createOrgKey = data['createOrgKey'];
            this.begYear = data['begYear'] || '';
            this.endYear = data['endYear'] || '';
            this.noPublishAD = data['noPublishAD'] ? 1 : '';
            this.NoIndex = data['NoIndex'];
            this.FileStartTimes = data['FileStartTimes'] || '';
            this.FileEndTimes = data['FileEndTimes'] || '';
            this.publishStartTime = data['publishStartTime'] || '';
            this.publishEndTime = data['publishEndTime'] || '';
            this.gcStatus = data['gcStatus'] || '';
            this.waitComplete = data['waitComplete'] ? data['waitComplete'] : '';
            this.claimStartTime = data['claimStartTime'] || '';
            this.claimEndTime = data['claimEndTime'] || '';
            this.type = data['type'] || '';
            this.GCOver = data['GCOver'] || '';
            this.country = data['country'] || '';

            for(let key in data){
                if(key == 'country' || key == 'publishStartTime' || key == 'publishEndTime' || key == 'GCOver' || key == 'type' || key == 'claimStartTime' || key == 'createOrgKey' || key == 'claimEndTime' || key == 'waitComplete' || key == 'gcStatus' || key == 'FileStartTimes' || key == 'FileEndTimes' || key == 'NoIndex' || key == 'libKey' || key == 'equal' || key == 'orgKey' || key == 'begYear' || key == 'endYear' || key == 'noPublishAD'){

                }else{
                    keyWordObj[key] = data[key];
                }
            }
            this.keyWordObj = keyWordObj;
        },
        openRootModal(){// 分页公开
            if(this.role < 1 || this.role > 4){
                this.$message({message: '暂无权限操作',type: 'warning'});
                return false;
            }
            if(this.checkList && this.checkList.length && this.stationKey){
                this.isRootShow = true 
            }else{
                this.$message({message: '请勾选家谱',type: 'warning'});
            }
        },
        async getJiapuAllList(){// 全部谱目列表
            this.loading = true;
            let data=await api.getAxios('catalog/back?siteKey='+this.stationKey+'&startFileTimes=&endFileTimes='+'&condition='+this.condition+'&isPublish='+this.isPublish+'&isPlace='+this.isPlace+'&fileName='+this.fileName+'&keyWord='+this.keyWord+'&startTime='+this.startTime+'&endTime='+this.endTime+'&noPublishAD='+this.noPublishAD+'&begYear='+this.begYear+'&endYear='+this.endYear+'&libKey='+this.libKey+'&orgKey='+this.orgKey+'&equal='+this.equal+'&keyWordObj='+JSON.stringify(this.keyWordObj)+'&prop='+this.prop+'&order='+this.order+'&page=0&limit=3000');
            this.loading = false;
            if(data.status == 200){
                this.checkList = data.result.list;
                this.checkList.map((item)=>{
                    item.select = true;
                });

                if(this.checkList && this.checkList.length && this.stationKey){
                    this.isSitePerspective = true; 
                }else{
                    this.$message({message: '没有检索到家谱',type: 'warning'});
                }
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        openSiteModal(flag = false){// 家谱分发
            if(flag){
                if(this.keyWordObj.surname || this.keyWordObj.place || this.keyWordObj.batchKey){
                    this.getJiapuAllList();
                }else{
                    this.$message({message: '请输入姓氏或谱籍地或批次',type: 'warning'});
                }
            }else{
                if(this.checkList && this.checkList.length && this.stationKey){
                    this.isSitePerspective = true; 
                }else{
                    this.$message({message: '请勾选家谱',type: 'warning'});
                }
            }
        },
        openSwapModal(){// 交换家谱
            if(this.role < 1 || this.role > 2){
                this.$message({message: '暂无权限',type: 'warning'});
                return false;
            }
            if(this.checkList && this.checkList.length && this.stationKey){
                this.isSwapModal = true 
            }else{
                this.$message({message: '请勾选家谱',type: 'warning'});
            }
        },
        handleCompleteCatalog(t){// 完结家谱
            if(t == 'all'){
                this.$confirm('共'+this.total+'条记录，确认完结全部待完结的谱目吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.completeCatalogAll();
                }).catch(() => {});
            }
            if(t == 'some'){
                let gcKeyArray = [];
                this.checkList.forEach((ele) => {
                    gcKeyArray.push(ele._key);
                });
                if(this.checkList.length){
                    this.$confirm('共选中'+this.checkList.length+'条记录，确认完结该批次的待完结的谱目吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.completeCatalogsome(gcKeyArray)
                    }).catch(() => {});
                }else{
                    ADS.message('请勾选谱目！');
                }
            }
        },
        async completeCatalogAll(){
            this.loading = true;
            let result = await api.patchAxios('catalog/allPass',{
                'siteKey': this.stationKey,
                'userKey': this.userId,
            });
            this.loading = false;
            if(result.status == 200){
                ADS.message('全部完结谱目成功！', true);
                this.getJiapuList();
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' })
            }
        },
        async completeCatalogsome(gcKeyArray){
            this.loading = true;
            let result = await api.patchAxios('catalog/batchPass',{
                'siteKey': this.stationKey,
                'userKey': this.userId,
                'gcKeyArray': gcKeyArray,
            });
            this.loading = false;
            if(result.status == 200){
                if(result.data && result.data.length){
                    this.warnList = result.data;
                    this.isWarn = true;
                }else{
                    ADS.message('批量完结谱目成功！', true);
                }
                this.getJiapuList();
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' })
            }
        },
    },
    computed: {
        ...mapState({
            userName: state => state.nav.userName,
            userId: state => state.nav.userId,
            stationKey: state => state.nav.stationKey,
            role: state => state.nav.role,
            bindTotal: state => state.nav.bindTotal,
            bindPage: state => state.nav.bindPage,
            catalogStatusO: state => state.nav.catalogStatusO,
            orgAdmin: state => state.nav.orgAdmin,
            orgId: state => state.nav.orgId,
            roleKey: state => state.nav.roleKey,
        })
    },
    watch:{
        'fieldFilters':function(newV,oldV){
            this.getJiapuList();
        },
    },
};
</script>
<style scoped lang="scss">
.wrap{
    position: relative;
    width: calc(100% - 200px);
    height: 100%;
    padding-left: 200px;
    text-align: left;
    .content{
        position: relative;
        width: 100%;
        height: calc(100% - 20px);
        background: #EFF1F5;
        padding-bottom: 20px;
    }
}
.btn_wrap_left{
    width: calc(100% - 40px);
    margin: 5px 20px;
    display: flex;
    align-items: center;
    input{
        width: 140px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #fff;
        border: none;
        outline: none;
        border-radius: 20px;
        cursor: pointer;
        margin-right: 20px;
        &.root{
            background:#fff url('../../assets/icon/root.svg') 35px 50% no-repeat;
            background-size: 16px;
            text-indent: 20px;
        }
        &.root:hover{
            background-image: url('../../assets/icon/rootActive.svg');
            color: #4C95FF;
        }
        &.swap{
            background:#fff url('../../assets/icon/swap.svg') 35px 50% no-repeat;
            background-size: 16px;
            text-indent: 20px;
        }
        &.swap:hover{
            background-image: url('../../assets/icon/swapActive.svg');
            color: #4C95FF;
        }
    }
}
.marginLeft20{
    margin-left: 20px;
}

.foot-wrap{
    width: calc(100% - 40px);
    padding:  0 20px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>

