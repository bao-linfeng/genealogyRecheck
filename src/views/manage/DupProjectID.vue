<template>  
    <div class="wrap">
        <Sidebar />
        <div class="content">
            <div class="nav-wrap">
                <div class="nav-left">
                    <h3 class="title">开放谱书列表(总共{{total}}条数据)</h3>
                </div>
                <div class="nav-left">
                    <el-button v-if="roleType == 'host' && openStatus == 'opened'" type="primary" size="small" @click="handleClaimSome">批量设置认领机构</el-button>
                    <el-button v-if="roleType == 'host'" type="primary" size="small" @click="handleCancelSome">批量作废</el-button>
                    <el-button v-if="roleType == 'host' && openStatus == 'waitOpen'" type="primary" size="small" @click="handleOpenSome">批量开放</el-button>
                </div>
            </div>
            <div class="search-wrap">
                <el-input class="width120" placeholder="请输入谱ID" v-model="gcKey" clearable size="small"></el-input>
                <el-input class="width150" placeholder="请输入谱名" v-model="genealogyName" clearable size="small"></el-input>
                <el-date-picker
                    class="width250"
                    v-model="Filetimes"
                    type="daterange"
                    unlink-panels
                    size="small"
                    :start-placeholder="'档案开始时间'"
                    :end-placeholder="'档案结束时间'"
                />
                <el-select class="width100" v-model="openStatus" size="small" placeholder="开放状态">
                    <el-option
                        v-for="item in openStatusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select class="width100" v-model="takeStatus" size="small" placeholder="拍摄状态">
                    <el-option
                        v-for="item in takeStatusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select class="width100" v-model="condition" size="small" placeholder="谱状态">
                    <el-option
                        v-for="item in conditionList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                
                <el-button type="primary" size="small" @click="getDataList">检索</el-button>
                <el-checkbox class="marginL10" size="mini" v-model="isShowSearch">展开</el-checkbox>
            </div>
            <div class="search-wrap" v-show="isShowSearch">
                <el-input class="width150" placeholder="请输入文件名" v-model="fileName" clearable size="small"></el-input>
                <el-input class="width150" placeholder="请输入档名" v-model="Filenames" clearable size="small"></el-input>
                <el-date-picker
                    class="width250"
                    v-model="time"
                    type="daterange"
                    unlink-panels
                    size="small"
                    :start-placeholder="'认领开始时间'"
                    :end-placeholder="'认领结束时间'"
                />
                <el-select v-if="roleType == 'host'" class="width100" v-model="orgKey" placeholder="上传机构" size="small">
                    <el-option
                        v-for="item in orgList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="table-wrap" :class="{active: isShowSearch}">
                <vxe-table
                    border
                    class="adai-table"
                    :loading="loading"
                    resizable
                    keep-source
                    highlight-current-row
                    ref="xTable"
                    :height="h"
                    :align="'center'"
                    :data="tableData"
                    :row-class-name="rowClassName"
                    @checkbox-change = "checkboxChange"
                    @checkbox-all = "checkboxChange">
                    <vxe-table-column type="checkbox" field="checkbox" width="60" fixed="left"></vxe-table-column>
                    <vxe-table-column field="fileName" width="100" title="文件标题"></vxe-table-column>
                    <vxe-table-column field="Filenames" width="100" title="档名"></vxe-table-column>
                    <vxe-table-column field="Filetimes" width="100" title="档案时间"></vxe-table-column>
                    <vxe-table-column field="_key" width="100" title="谱ID"></vxe-table-column>
                    <vxe-table-column field="surname" width="60" title="姓氏"></vxe-table-column>
                    <vxe-table-column field="genealogyName" min-width="100" title="谱名"></vxe-table-column>
                    <vxe-table-column field="publish" width="80" title="出版年"></vxe-table-column>
                    <vxe-table-column field="place" width="150" title="谱籍_现代地名"></vxe-table-column>
                    <vxe-table-column field="volume" width="100" title="总卷数"></vxe-table-column>
                    <vxe-table-column field="lostVolume" width="100" title="缺卷说明"></vxe-table-column>

                    <vxe-table-column field="hasVolume" width="100" title="可拍册数"></vxe-table-column>
                    <vxe-table-column field="volumeNumber" width="100" title="实拍册数"></vxe-table-column>
                    <vxe-table-column field="passVolumeNumber" width="100" title="通过册数"></vxe-table-column>
    
                    <vxe-table-column field="publicTask" width="100" title="开放状态"></vxe-table-column>
                    <vxe-table-column field="publicTime" width="100" title="开放时间"></vxe-table-column>
                    <vxe-table-column field="claimOrgName" width="100" title="认领机构"></vxe-table-column>
                    <vxe-table-column field="claimTime" width="100" title="认领时间"></vxe-table-column>
                    <vxe-table-column field="countdownTime" width="80" title="倒计时"></vxe-table-column>
                    <vxe-table-column field="orgName" width="100" title="上传机构"></vxe-table-column>

                    <vxe-table-column field="takeStatus" width="100" title="拍摄状态"></vxe-table-column>
                    <vxe-table-column field="condition" width="80" title="谱状态"></vxe-table-column>

                    <vxe-table-column field="action" title="操作" fixed="right" width="200" :cell-render="{name: 'AdaiActionButton2', attr: {data: actionData}, events: {'detail': showDetail, 'log': showLog, 'edit': showEdit, 'cancel': handleCancel, 'catalogPass': handleCatalogPass, 'claim': handleCkaim, 'open': handleOpen}}"></vxe-table-column>
                </vxe-table>
            </div>
            <vxe-pager
                :loading="loading"
                align="center"
                @page-change = "changePage"
                :current-page.sync="page"
                :page-size.sync="limit"
                :total="total"
                :layouts="['PrevJump', 'PrevPage', 'JumpNumber','NextPage', 'NextJump', 'FullJump', 'Total']">
            </vxe-pager>
        </div>
        <!-- 查看谱目 -->
        <CatalogView v-if="isShow == 1" :read="true" :dataKey="detail._key" :vid="''" v-on:close="isShow = 0" />
        <!-- 日志记录 -->
        <LogModule v-if="isShow == 2" :gid="detail._key" v-on:close="isShow = 0" />
        <!-- 谱目编辑 -->
        <EditCatalog v-if="isShow == 4" :read="false" :dataKey="detail._key" :conditionEdit="true" :vid="''" v-on:close="closeEdit" />
        <!-- 领取 -->
        <ClaimBook v-if="isShow == 3" :detail="detail" :list="catalogKeyArr" v-on:close="isShow = 0" v-on:save="handleSaveClaim" />
        <!-- 谱目完结 -->
        <CatalogFinish v-if="isShow == 5" :dataKey="detail._key" v-on:close="isShow = 0" v-on:save="catalogFinishSave" />
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import { mapState, mapActions, mapGetters } from "vuex";
import Sidebar from "../../components/sidebar/Sidebar.vue";
import CatalogView from '../../components/takeCamera/CatalogView.vue';
import LogModule from '../../components/discussed/LogModule.vue';
import ClaimBook from '../../components/openBook/ClaimBook.vue';
import EditCatalog from '../../components/takeCamera/EditCatalog.vue';
import CatalogFinish from '../../components/myGenealogy/CatalogFinish.vue';

export default {
    name: "genealogyRecheck",
    components: {
        CatalogView, LogModule, Sidebar, ClaimBook, EditCatalog, CatalogFinish, 
    },
    data: () => {
        return {
            loading: false,
            tableData: [],
            h: 1080,
            catalogKeyArr: [],

            gcKey: '',
            genealogyName: '',
            fileName: '',
            Filenames: '',
            time: [],
            startTime: '',
            endTime: '',
            Filetimes: '',
            FiletimesStartTime: '',
            FiletimesEndTime: '',
            orgKey: '',

            page: 1,
            pages: 0,
            total: 0,
            limit: 20,
            orgList: [],

            openStatus: '',
            openStatusList: [
                {'label': '开放状态', 'value': ''},
                {'label': '未开放', 'value': '0'},
                {'label': '已开放', 'value': '1'}
            ],
            takeStatus: '',
            takeStatusList: [
                {'label': '拍摄状态', 'value': ''},
                {'label': '未认领', 'value': '0'},
                {'label': '未拍摄', 'value': '1'},
                {'label': '拍摄中', 'value': '2'},
                {'label': '拍摄完成', 'value': '3'}
            ],
            condition: '',
            conditionList: [
                {'label': '谱状态', 'value': ''},
                {'label': 'nf|可拍', 'value': 'nf'},
                {'label': 'f|已完结', 'value': 'f'},
                {'label': 'c|作废', 'value': 'c'},
            ],
            field_main: [],
            field_branch: [],

            actionData: [
                {'label': '详情', 'value': 'detail'}, 
                {'label': '记录', 'value': 'log'}, 
                // {'label': '完结', 'value': 'catalogPass'},
                {'label': '认领', 'value': 'claim'},
            ],
            detail: {},
            isShow: 0,
            gcStatusO: {'30': '待开放', '35': '已开放', '40': '已认领'},
            isShowSearch: false,
        };
    },
    created:function(){
        this.h = window.innerHeight - 140;
    },
    mounted:function(){
        if(this.roleType == 'host'){
            this.actionData = [
                {'label': '详情', 'value': 'detail'}, 
                {'label': '记录', 'value': 'log'}, 
                // {'label': '编辑', 'value': 'edit'},
                {'label': '作废', 'value': 'cancel'},
                // {'label': '完结', 'value': 'catalogPass'},
                // {'label': '开放', 'value': 'open'},
            ];
            this.getOrgList();
        }else{
            this.openStatus = '';
            this.orgKey = this.orgId;
        }

        this.getDataList();
    },
    methods:{
        async getOrgList(){// 机构列表
            let data = await api.getAxios('org?siteKey='+this.stationKey+'&name=');
            if(data.status == 200){
                this.orgList = data.data.map((ele, index)=>{
                    return {'label': ele.organizationNo+'('+ele.name+')', 'value': ele._key};
                });
                this.orgList.unshift({'label': '全部机构', 'value': ''});
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' });
            }
        },
        handleSaveClaim(){
            this.isShow = 0;
            this.getDataList();
        },
        showDetail({row}){// 详情
            this.isShow = 1;
            this.detail = row;
        },
        showLog({row}){// 记录
            this.isShow = 2;
            this.detail = row;
        },
        showEdit({row}){// 编辑
            this.isShow = 4;
            this.detail = row;
        },
        closeEdit(f){
            this.isShow = 0;
            f ? this.getDataList() : null;
        },
        handleCancel({row}){// 作废
            this.isShow = 6;
            this.detail = row;
            this.$confirm('当前选中数据, 请确认是否作废谱书?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.singleCancelGC(row._key);
            }).catch(() => {});
        },
        async singleCancelGC(gcKey){// 单谱作废
            let result = await api.patchAxios('catalog/cancelGC', {'userKey': this.userId, 'siteKey': this.stationKey, 'gcKey': gcKey});
            if(result.status == 200){
                this.getDataList();
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' })
            }
        },
        async singleCancelGCBatch(gcKeyArray){// 批量作废谱
            let result = await api.patchAxios('catalog/cancelGCBatch', {'userKey': this.userId, 'siteKey': this.stationKey, 'gcKeyArray': gcKeyArray});
            if(result.status == 200){
                this.getDataList();
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' })
            }
        },
        handleCatalogPass({row}){// 完结
            if(row.condition == 'nf' || row.condition == 'f'){
                this.isShow = 5;
                this.detail = row;
            }else{
                this.$message({message: '该谱目目前状态不允许进行完结操作！', type: 'warning'});
            }
        },
        catalogFinishSave(){
            this.isShow = 0;
            this.getDataList();
        },
        handleCkaim({row}){// 领取
            this.detail = row;
            this.isShow = 3;
        },
        handleOpen({row}){// 开放
            this.detail = row;
            this.$confirm('本谱书符合开放条件,请确认是否开放本谱书?', '提示', {
                confirmButtonText: '确定开放',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.patchOpenGC([row._key]);
            }).catch(() => {});
        },
        handleCancelSome(){// 批量作废
            if(!this.catalogKeyArr.length){
                return ADS.message('请勾选家谱！');
            }
            this.$confirm('当前选中 '+this.catalogKeyArr.length+' 条数据, 请确认是否作废谱书?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.singleCancelGCBatch(this.catalogKeyArr);
            }).catch(() => {});
        },
        handleOpenSome(){// 批量开放
            if(!this.catalogKeyArr.length){
                return ADS.message('请勾选家谱！');
            }
            this.$confirm('当前选中 '+this.catalogKeyArr.length+' 条数据, 请确认是否开放谱书?', '提示', {
                confirmButtonText: '确定开放',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.patchOpenGC(this.catalogKeyArr);
            }).catch(() => {});
        },
        handleClaimSome(){
            if(!this.catalogKeyArr.length){
                return ADS.message('请勾选家谱！');
            }
            this.detail = {};
            this.isShow = 3;
        },
        async patchOpenGC(catalogKeyArray){// 批量开放 api
            let result = await api.patchAxios('v3/review/catalog/openGC', {'userKey': this.userId, 'siteKey': this.stationKey, 'catalogKeyArray': catalogKeyArray});
            if(result.status == 200){
                if(result.data && result.data.length){
                    this.$alert(result.data.join(), '错误提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.getDataList();
                        }
                    });
                }else{
                    this.getDataList();
                }
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' })
            }
        },
        changePage({currentPage}){// 页码切换回调
            this.page = currentPage;
            this.getDataList();
        },
        checkboxChange({records}){// 多选
            let catalogKeyArr = [];
            records.forEach((ele) => {
                catalogKeyArr.push(ele._key);
            });
            this.catalogKeyArr = catalogKeyArr;
        },
        
        rowClassName ({ row, rowIndex }) {
            
        },
        async getDataList(){
            this.tableData = [];
            this.catalogKeyArr = [];
            this.loading = true;
            let data = await api.getAxios('catalog/openGCNew?siteKey='+this.stationKey+'&orgKey='+this.orgKey+'&openStatus='+this.openStatus+'&genealogyName='+this.genealogyName+'&fileName='+this.fileName+'&Filenames='+this.Filenames+'&gcKey='+this.gcKey+'&startTime='+this.startTime+'&endTime='+this.endTime+'&FiletimesStartTime='+this.FiletimesStartTime+'&FiletimesEndTime='+this.FiletimesEndTime+'&takeStatus='+this.takeStatus+'&condition='+this.condition+'&page='+this.page+'&limit='+this.limit);
            this.loading = false;
            if(data.status == 200){
                this.tableData = data.result.list.map((ele) => {
                    ele.Filetimes = ele.Filetimes ? ADS.getLocalTime(ele.Filetimes) : '';
                    ele.publicTime = ele.publicTime ? ADS.getLocalTime(ele.publicTime) : '';
                    ele.claimTime = ele.claimTime ? ADS.getLocalTime(ele.claimTime) : '';
                    return ele;
                });
                this.pages = data.result.pageNum;
                this.total = data.result.total;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
    },
    computed: {
        ...mapState({
            userName: state => state.nav.userName,
            userId: state => state.nav.userId,
            stationKey: state => state.nav.stationKey,
            role: state => state.nav.role,
            orgId: state => state.nav.orgId,
            pathname: state => state.nav.pathname,
            isResize: state => state.nav.isResize,
            roleType: state => state.nav.roleType,
        })
    },
    watch:{
        'time': function(nv, ov){
            if(nv){
                this.startTime = new Date(nv[0]).getTime();
                this.endTime = new Date(nv[1]).getTime();
            }else{
                this.startTime = '';
                this.endTime = '';
            }
            this.getDataList();
        },
        'Filetimes': function(nv, ov){
            console.log(nv);
            if(nv){
                this.FiletimesStartTime = new Date(nv[0]).getTime();
                this.FiletimesEndTime = new Date(nv[1]).getTime();
            }else{
                this.FiletimesStartTime = '';
                this.FiletimesEndTime = '';
            }
        },
        'openStatus': function(nv, ov){
            this.getDataList();
        },
        'orgKey': function(){
            this.getDataList();
        },
        'isShowSearch': function(nv, ov){
            if(nv){
                this.h = this.h - 40;
            }else{
                this.h = this.h + 40;
            }
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
        height: 100%;
        background: #EFF1F5;
        .nav-wrap{
            position: relative;
            padding: 0 20px;
            width: calc(100% - 40px);
            display: flex;
            height: 50px;
            justify-content: space-between;
            align-items: center;
            .nav-left{
                position: relative;
                height: 100%;
                display: flex;
                align-items: center;
                .input{
                    position: relative;
                    width: 240px;
                    height: 30px;
                    line-height: 30px;
                    text-indent: 10px;
                    border: 1px solid #ddd;
                    border-radius: 3px;
                    outline: none;
                }
                .p{
                    font-size: 8px;
                }
            }
        }
        .search-wrap{
            position: relative;
            padding: 0 20px;
            width: calc(100% - 40px);
            display: flex;
            height: 40px;
            align-items: center;
        }
        .table-wrap{
            position: relative;
            height: calc(100% - 140px);
            width: 100%;
            &.active{
                height: calc(100% - 180px);
            }
        }
        .place-wrap{
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            width: 500px;
            z-index: 10000;
            background-color: #fff;
        }
    }
}
.width150{
    width: 150px;
} 
.width100{
    width: 100px;
} 
.width120{
    width: 120px;
}
.width250{
    width: 250px !important;
}
.marginR10{
    margin-right: 10px;
}
.marginL10{
    margin-left: 10px;
}
</style>

