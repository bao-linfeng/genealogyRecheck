<template>  
    <div class="wrap">
        <Sidebar />
        <div class="content">
            <div class="nav-wrap">
                <span class="title">快捷查询</span>
                <div class="head-right">
                    
                </div>
            </div>
            <div class="search-wrap" :class="{h140: count == 3}">
                <div class="search-box" v-for="(item, i) in searchArr" :key="i">
                    <el-checkbox class="marginR5" v-model="item.check"></el-checkbox>
                    <label class="label" for="">{{item.label}}</label>
                    <el-input class="width100 marginR20" :class="{'width200': ['genealogyName', 'place' ,'LocalityModern'].indexOf(item.value) > -1}" v-model="searchObject[item.value]" :placeholder="'请输入'+item.label" clearable></el-input>
                </div>
                <el-checkbox class="marginR5" v-model="isKeyWord"></el-checkbox>
                <el-input class="width200 marginR20" v-model="keyWord" placeholder="请输入一世祖或始迁祖" clearable></el-input>
                <el-button type="primary" size="medium" @click="getDataList">检索</el-button>
                <el-button type="primary" size="medium" @click="fieldRcover">字段复原</el-button>
                <el-checkbox class="margin10" v-model="haswu">无或空字符堂号</el-checkbox>
            </div>
            <div class="vex-table-box" :class="{h140: count == 3}">
                <el-table
                    :data="tableData"
                    :height="h"
                    border
                    style="width: 100%"
                    @sort-change="sortChangeEvent">
                    <el-table-column fixed="left" v-for="(item,index) in field_main" :prop="item.fieldName" :label="item.fieldMeans" :key="'main'+index" width="100" align="center"></el-table-column>
                    <el-table-column v-for="(item,index) in field_branch" :prop="item.fieldName" :label="item.fieldMeans" :key="'branch'+index" width="100" align="center"></el-table-column>
                    <el-table-column prop="memo" label="备注" width="150" align="center"></el-table-column>
                    <el-table-column prop="explain" label="说明" width="150" align="center"></el-table-column>
                    <el-table-column prop="orgName" label="供应商" width="100" align="center"></el-table-column>
                    <el-table-column prop="condition" label="谱状态" width="100" align="center"></el-table-column>
                    <el-table-column prop="Filetimes" label="档案时间" width="130" align="center" sortable="custom"></el-table-column>
                    <el-table-column prop="Filenames" label="档名" width="100" align="center"></el-table-column>
                    <el-table-column prop="bookId" label="谱书编号" width="100" align="center"></el-table-column>
                    <el-table-column prop="DGS" label="DGS号码" width="100" align="center"></el-table-column>
                    <el-table-column prop="genealogyGroupID" label="家谱群组ID" width="100" align="center"></el-table-column>
                    <el-table-column prop="updateUserName" label="更新人员" width="100" align="center"></el-table-column>
                    <el-table-column prop="GCOverO" label="编目状态" width="100" align="center"></el-table-column>
                    <el-table-column prop="NoIndexO" label="索引状态" width="100" align="center"></el-table-column>
                    <el-table-column prop="gcStatusO" label="谱书状态" width="100" align="center"></el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="150"
                        align="center">
                        <template slot-scope="scope">
                            <button class="AdaiActionButton" @click="getDetail(scope.row)">详情</button>
                            <button class="AdaiActionButton" v-if="scope.row.imageLink" @click="readBook(scope.row)">FS影像</button>
                            <button class="AdaiActionButton" v-if="scope.row.imageOriginal == 'pipeline'" @click="readBook(scope.row)">影像</button>
                            <button class="AdaiActionButton" v-if="!scope.row.imageLink && scope.row.imageOriginal != 'pipeline' && (scope.row.hasFileOrRemark || scope.row.remark || scope.row.needFillFields)" @click="showAnnex(scope.row)">附件</button>
                            <button class="AdaiActionButton" @click="getLog(scope.row)">记录</button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-foot">
                    <div class="count-wrap">
                        
                    </div>
                    <vxe-pager
                        :loading="loading"
                        :current-page="page"
                        :page-size="limit"
                        :total="total"
                        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Total']"
                        @page-change="handlePageChange">
                    </vxe-pager>
                </div>
            </div>
        </div>
        <!-- 记录 -->
        <LogModule v-if="isShow == 3" :gid="id" v-on:close="closeModule" />
        <!-- 编辑 -->
        <EditCatalog v-if="isShow == 2" :read="isRead" :dataKey="id" :vid="''" v-on:close="closeModule" />
        <!-- 详情 -->
        <CatalogView v-if="isShow == 1" :read="isRead" :dataKey="id" :vid="''" v-on:close="closeModule" v-on:save="handleSave" />
        <!-- 附件 -->
        <AnnexModal v-if="isShowAnnex" :gid="gid" :row="annexRow" v-on:close-annex="isShowAnnex = false" />
        <!-- loading -->
        <Loading v-show="loading" />
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import Sidebar from "../../components/sidebar/Sidebar.vue";
import { mapState, mapActions, mapGetters } from "vuex";
import LogModule from '../../components/discussed/LogModule.vue';
import EditCatalog from '../../components/takeCamera/EditCatalog.vue';
import CatalogView from '../../components/takeCamera/CatalogView.vue';
import AnnexModal from "../../components/QingTimeGenealogy/AnnexModal.vue";
export default {
    name: "singleQuickSearch",
    components: {
        Sidebar, LogModule, EditCatalog, CatalogView, AnnexModal,
    },
    data: () => {
        return {
            loading: false,
            tableData: [],
            page: 1,
            pages: 0,
            limit: 20,
            total: 0,
            prop: '',
            order: '',
            genealogyName: '',
            gcKey: '',
            place: '',
            surname: '',
            searchArr: [
                {'label': '作者', 'value': 'authors', 'check': false},
                {'label': '谱名', 'value': 'genealogyName', 'check': false},
                {'label': '姓氏', 'value': 'surname', 'check': false},
                {'label': '谱籍地(现)', 'value': 'place', 'check': false},
                {'label': '谱籍地(原)', 'value': 'LocalityModern', 'check': false},
                {'label': '堂号', 'value': 'hall', 'check': false},
                {'label': '始迁祖', 'value': 'migrationAncestor', 'check': false},
                {'label': '一世祖', 'value': 'firstAncestor', 'check': false},
                {'label': '卷数', 'value': 'volume', 'check': false},
                {'label': '出版年', 'value': 'publish', 'check': false},
                // {'label': '一世祖或始迁祖', 'value': 'keyWord', 'check': false},
            ],
            searchObject: {

            },
            time: '',
            startTime: '',
            endTime: '',
            h: 0,
            id: '',
            isShow: 0,
            attrData: [
                {'label': '详情', 'value': 'detail'},
                // {'label': '编辑', 'value': 'edit'},
                {'label': 'FS影像', 'value': 'readBook'},
                {'label': '记录', 'value': 'log'},
            ],
            isRead: false,
            detail: {},
            haswu: false,
            field_main: [],
            field_branch: [],
            count: 2,
            isShowAnnex: false,
            annexRow: {},
            gid: '',
            keyWord: '',
            isKeyWord: false,
        };
    },
    created:function(){
        this.h = window.innerHeight - 50 - 50 - 50 - 48;
        if(window.innerWidth >= 1215 && window.innerWidth <= 1550){
            this.h = this.h - 40;
            this.count = 3;
        }
    },
    mounted:function(){
        this.field_main = [
            {'fieldMeans': '文件标题', 'fieldName': 'fileName'},
            {'fieldMeans': '谱ID', 'fieldName': '_key'},
            {'fieldMeans': '谱名', 'fieldName': 'genealogyName'},
            {'fieldMeans': '姓氏', 'fieldName': 'surname'},
            {'fieldMeans': '出版年', 'fieldName': 'publish'},
            {'fieldMeans': '堂号', 'fieldName': 'hall'},
        ];

        this.field_branch = [
            {'fieldMeans': '一世祖', 'fieldName': 'firstAncestor'},
            {'fieldMeans': '始迁祖', 'fieldName': 'migrationAncestor'},
            {'fieldMeans': '谱籍地(现代)', 'fieldName': 'place'},
            {'fieldMeans': '谱籍地(原谱)', 'fieldName': 'LocalityModern'},
            {'fieldMeans': '总卷数', 'fieldName': 'volume'},
            {'fieldMeans': '缺卷说明', 'fieldName': 'lostVolume'},
            {'fieldMeans': '可拍册数', 'fieldName': 'hasVolume'},
            {'fieldMeans': '实拍册数', 'fieldName': 'volumeNumber'},
            {'fieldMeans': '作者', 'fieldName': 'authors'},
            {'fieldMeans': '作者职务', 'fieldName': 'authorJob'},
            {'fieldMeans': '版本类型', 'fieldName': 'version'},
            {'fieldMeans': '重复谱ID', 'fieldName': 'Dupbookid'},
        ];

        this.id = ADS.getQueryVariable('id');
        this.getGenealogyDetail();
    },
    methods:{
        showAnnex(row){
            this.annexRow = row;
            this.gid = row._key;
            this.isShowAnnex = true;
        },
        readBook(row){
            if(row.imageLink){
                window.open(row.imageLink);
            }else if(row.imageOriginal == 'pipeline'){
                window.open('/'+this.pathname+'/cameraImage?device='+row.device+'&vid='+row.volumeKey+'&gid='+row._key+'&genealogyName='+row.genealogyName);
            }else{
                this.$XModal.message({ message: '暂无无法查看影像', status: 'warning' });
            }
        },
        fieldRcover(){
            let searchObject = {};
            this.searchArr.forEach((ele, i) => {
                searchObject[ele.value] = this.detail[ele.value] || '';
            });
            this.searchObject = searchObject;
        },
        async getGenealogyDetail(){
            const result = await api.getAxios('catalog/detail?catalogKey='+this.id);
            if(result.status == 200){
                let searchObject = {};
                this.searchArr.forEach((ele, i) => {
                    searchObject[ele.value] = result.data[ele.value] || '';
                });
                this.searchObject = searchObject;
                this.detail = result.data;
                document.title = this.detail.genealogyName;

                // this.getDataList();
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' });
            }
        },
        sortChangeEvent({column, prop, order}){
            console.log(column, prop, order);
            this.prop = prop || '';
            this.order = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : '';
            this.getDataList();
        },
        async getDataList(){
            console.log(this.searchArr);
            let searchObject = {'haswu': this.haswu ? '1' : '0'};
            this.searchArr.forEach((ele, i) => {
                if(ele.check){
                    searchObject[ele.value] = this.searchObject[ele.value];
                }
            });
            this.loading = true;
            let data = await api.postAxios('catalog/singleGCQuickQuery',{
                'searchObject': searchObject,
                'keyWord': this.isKeyWord ? this.keyWord : '',
                'targetGCKey': this.id,
                'prop': this.prop,
                'order': this.order,
                'page': this.page,
                'limit': this.limit,
            });
            this.loading = false;
            if(data.status == 200){
                this.tableData = data.result.list.map((ele) => {
                    ele.claimOrgNameO = ele.claimOrgName + '|' + ele.claimOrganizationNo;
                    ele.createTimeO = ele.createTime ? ADS.getLocalTime(ele.createTime) : '';
                    ele.Filetimes = ele.Filetimes ? ADS.getLocalTime(ele.Filetimes) : '';

                    return ele;
                });
                this.pages = data.result.pageNum;
                this.total = data.result.total;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' });
            }
        },
        handlePageChange({ currentPage, pageSize }){
            this.page = currentPage;
            this.getDataList();
        },
        getDetail(row){
            this.id = row._key;
            this.isShow = 1;
            this.isRead = true;
        },
        getLog(row){
            this.id = row._key;
            this.isShow = 3;
        },
        closeModule(data){
            console.log(data);
            this.isShow = 0;
            this.isRead = false;
            if(data){
                this.getDataList();
            }
        },
        handleSave(){

        },
    },
    computed: {
        ...mapState({
            TOKEN: state => state.nav.TOKEN,
            userName: state => state.nav.userName,
            userId: state => state.nav.userId,
            stationKey: state => state.nav.stationKey,
            role: state => state.nav.role,
            orgAdmin: state => state.nav.orgAdmin,
            pathname: state => state.nav.pathname,
            orgId: state => state.nav.orgId,
        })
    },
    watch:{
        'time': function(nv, ov){
            console.log(nv);
            if(nv){
                this.startTime = new Date(nv[0]).getTime();
                this.endTime = new Date(nv[1]).getTime();
            }else{
                this.startTime = '';
                this.endTime = '';
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
            width: calc(100% - 40px);
            padding: 0 20px;
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title{
                font-weight: bold;
            }
            .head-right{
                position: relative;
                display: flex;
                align-items: center;
            }
        }
        .search-wrap{
            position: relative;
            width: calc(100% - 40px);
            // width: 900px;
            height: 100px;
            padding: 0 20px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            &.h140{
                height: 140px;
            }
            .search-box{
                .label{
                    margin-right: 3px;
                }
            }
        }
        .vex-table-box{
            width: calc(100% - 40px);
            padding: 0 20px;
            height: calc(100% - 150px);
            &.h140{
                height: calc(100% - 190px);
            }
            &.active{
                height: calc(100% - 250px);
            }
        }
    }
}
.page-foot{
    position: relative;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .count-wrap{
        font-size: 10px;
        font-weight: bold;
    }
}
.width100{
    width: 120px;
}
.width200{
    width: 200px;
}
.marginR10{
    margin-right: 10px;
}
.marginL10{
    margin-left: 10px;
}
.margin10{
    margin: 0 10px 0 5px;
}
.marginR5{
    margin-right: 5px;
}
.marginR20{
    margin-right: 20px;
}

@media screen and (max-width: 1400px) and (min-width: 1025px){
    .wrap{
        .content{
            .search-wrap{
                height: 140px;
            }
            .vex-table-box{
                height: calc(100% - 180px);
                &.h140{
                    height: calc(100% - 190px);
                }
                &.active{
                    height: calc(100% - 250px);
                }
            }
        }
    }
}
</style>

