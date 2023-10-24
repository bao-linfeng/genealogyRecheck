<template>  
    <div class="wrap">
        <Sidebar />
        <div class="wrap-box">
            <div class="head-wrap">
                <div class="head-left">
                    <h3 class="title">查重待议谱列表</h3>
                </div>
                <div class="head-right">
                    <el-button type="primary" size="small" @click="openBaseGenealogy">家谱总目录</el-button>
                    <!-- <el-button v-if="role >= 1 && role <= 3" type="primary" size="small" @click="openOverTimeBatch(4)">批量设置逾期谱</el-button> -->
                    <!-- <el-button v-if="role >= 1 && role <= 3" type="primary" size="small" @click="openOverTimeBatch(5)">批量更改状态</el-button> -->
                </div>
                <p class="condition">谱状态说明:f,审核通过且已拍摄;nf,审核通过未拍摄;r,无效谱;d,谱书重复;m,待议谱;c,作废谱。</p>
            </div>
            <div class="search-wrap">
                <el-input class="width150 marginR10" placeholder="请输入谱ID" v-model="gcKey" clearable size="small"></el-input>
                <el-input class="width150 marginR10" placeholder="请输入姓氏" v-model="surname" clearable size="small"></el-input>
                <el-input class="width150 marginR10" placeholder="请输入谱名" v-model="genealogyName" clearable size="small"></el-input>
                <el-input class="width150 marginR10" placeholder="请输入出版年" v-model="publish" clearable size="small"></el-input>
                <el-input class="width150 marginR10" placeholder="请输入文件标题" v-model="fileName" clearable size="small"></el-input>
                <el-input class="width150 marginR10" placeholder="请输入档名" v-model="Filenames" clearable size="small"></el-input>
                <el-select v-if="role <=3  && role >=1" class="width150 marginR10" v-model="orgKey" placeholder="上传机构" size="small">
                    <el-option
                        v-for="item in orgList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select class="width150 marginR10" v-model="isOverTime" placeholder="逾期状态" size="small">
                    <el-option
                        v-for="item in overTimeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" size="small" @click="getDataList">检索</el-button>
            </div>
            <div class="content">
                <vxe-table
                    border
                    class="adai-table"
                    resizable
                    keep-source
                    highlight-current-row
                    :loading="loading"
                    ref="xTable"
                    :height="h"
                    :align="'center'"
                    :data="tableData"
                    :cell-class-name="cellClassName"
                    :row-class-name="rowClassName"
                    @edit-closed="editClosedEvent"
                    @checkbox-change = "checkboxChange"
                    @checkbox-all = "checkboxChange"
                    :edit-config="{trigger: 'click', mode: 'row',showStatus: true, activeMethod:activeCellMethod}"
                    @cell-click="cellClickEvent"
                    :sort-config="{trigger: 'cell', orders: ['desc', 'asc', 'auto'], remote: true}"
                    @sort-change="sortChangeEvent">
                    <vxe-table-column type="checkbox" field="checkbox" width="60" fixed="left"></vxe-table-column>
                    <vxe-table-column v-for="(item,index) in field_main" :key="'field_main'+index" width="100" :field="item.fieldName" :title="item.fieldMeans" fixed="left"></vxe-table-column>
                    <vxe-table-column v-for="(item,index) in field_branch" :key="'field_branch'+index" width="100" :field="item.fieldName" :title="item.fieldMeans"></vxe-table-column>
                    <vxe-table-column field="memo" title="备注" width="150" show-overflow="title"></vxe-table-column>
                    <vxe-table-column field="explain" title="说明" width="150" show-overflow="title"></vxe-table-column>
                    <vxe-table-column field="orgName" title="供应商" width="100"></vxe-table-column>
                    <vxe-table-column field="Filetimes" width="100" title="档案时间"></vxe-table-column>
                    <vxe-table-column field="countdown" width="100" title="倒计时" sort-by="countdown" :sortable="['0', '1', '2'].indexOf(isOverTime) > -1"></vxe-table-column>
                    <vxe-table-column field="gcStatusO" title="谱书状态" width="100"></vxe-table-column>
                    <vxe-table-column field="createTimeO" width="100" title="上传时间"></vxe-table-column>
                    <vxe-table-column field="updateTimeO" width="100" title="打回时间"></vxe-table-column>
                    <vxe-table-column field="updateUserName" title="打回人" width="100"></vxe-table-column>
                    <vxe-table-column field="orgUpdateTimeO" title="复审提交时间" width="100"></vxe-table-column>
                    <vxe-table-column field="orgUpdateUserName" title="复审提交人" width="100"></vxe-table-column>
                    <vxe-table-column fixed="right" title="操作" width="180" :cell-render="{name: 'AdaiActionButton', attr: {data: actionData}, events:{'detail': openDetail, 'attachment': openAttachment, 'log': openLog, 'check': openCheck, 'singleQuick': singleQuick}}"></vxe-table-column>
                </vxe-table>
                <div class="page-wrap">
                    <p>每页{{limit}}条记录</p>
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
        <!-- 谱目编辑 -->
        <Drag class="drag2">
            <CatalogModule v-if="isCatalog" :dataKey="gid" v-on:close="closeCatalog1" />
        </Drag>
        <!-- 审核 -->
        <Drag class="drag1">
            <AttachmentModule v-if="isAttachment" :gid="gid" v-on:close="closeCatalog" v-on:prev="prev" />
        </Drag>
        <!-- 记录 -->
        <LogModule v-if="isShow == 3" :gid="gid" v-on:close="closeCatalog" />
        <OverTimeCatalog v-if="isShow == 4" :gid="gid" :list="catalogKeyArr" v-on:close="closeCatalog" />
        <CatalogCondition v-if="isShow == 5" :gid="gid" :list="catalogKeyArr" v-on:close="closeCatalog" />
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import Sidebar from "../../components/sidebar/Sidebar.vue";
import CatalogModule from '../../components/discussed/CatalogModule.vue';
import AttachmentModule from '../../components/discussed/AttachmentModule.vue';
import LogModule from '../../components/discussed/LogModule.vue';
import OverTimeCatalog from '../../components/discussed/OverTimeCatalog.vue';
import CatalogCondition from '../../components/discussed/CatalogCondition.vue';
import Drag from '../../components/Drag.vue';
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "toBeDiscussedGC",
    components: {
        CatalogModule, AttachmentModule, LogModule, OverTimeCatalog, CatalogCondition, Sidebar, 
        Drag, 
    },
    data: () => {
        return {
            tableData: [],
            active: 4,
            row: {},
            h: 1080,
            gid: '',
            catalogKeyArr: [],
            field_main: [],
            field_branch: [],
            gcKey: '',
            Filenames: '',
            surname: '',
            genealogyName: '',
            publish: '',
            fileName: '',
            orgKey: '',
            type: '',
            isOverTime: '0',
            page: 1,
            pages: 0,
            total: 0,
            limit: 30,
            orgList: [],
            overTimeList: [
                {'label': '全部谱书状态', 'value': ''}, 
                {'label': '待议复审', 'value': '2'}, 
                {'label': '待议谱', 'value': '0'}, 
                {'label': '逾期谱', 'value': '1'}
            ],
            loading: false,
            actionData: [
                {'label': '补充', 'value': 'attachment'},
                {'label': '编辑', 'value': 'detail'}, 
                {'label': '记录', 'value': 'log'}, 
                {'label': '快捷查询', 'value': 'singleQuick'},
            ],
            isShow: 0,
            isCatalog: false,
            isAttachment: false,
            simplePath: '',
            taskdays: 90,
            sortField: '', 
            sortType: 'asc',
        };
    },
    created:function(){
        this.h = window.innerHeight - 150;
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
        
    },
    mounted:function(){
        if(this.role >= 1 && this.role <= 3){
            this.isOverTime = '2';
            this.sortField = 'orgUpdateTime';
            this.actionData = [
                {'label': '审核','value': 'attachment'},
                {'label': '编辑','value': 'detail'}, 
                {'label': '记录','value': 'log'}, 
                {'label': '快捷查询', 'value': 'singleQuick'},
            ];
            this.type = 2;
            this.getOrgList();
        }else{
            this.isOverTime = '0';
            this.sortField = 'Filetimes';
            this.type = 1;
            this.orgKey = this.orgId;
        }
        
        this.getDataList();
    },
    methods:{
        sortChangeEvent({column, property, order, sortBy, sortList, $event}){
            console.log(property, order, sortBy);
            console.log(this.isOverTime);
            if(sortBy == 'countdown'){
                this.sortField = this.isOverTime === '2' ? 'orgUpdateTime' : (this.isOverTime === '0' || this.isOverTime === '1') ? 'Filetimes' : '';
            }else{
                this.sortField = sortBy;
            }
            
            this.sortType = order;
            this.getDataList();
        },
        singleQuick({ row }){
            window.open('/'+this.pathname+'/singleQuickSearch?id='+row._key, '_blank');
        },
        openBaseGenealogy(){
            open('/'+window.localStorage.getItem('pathname')+'/myGenealogy');
        },
        prev(data){
            this.simplePath = data;
        },
        openOverTimeBatch(f){
            if(this.catalogKeyArr.length){
                this.isShow = f;
            }else{
                this.$XModal.message({ message: f == 4 ? '请勾选待议逾期谱' : '请勾选需要批量修改的谱目', status: 'warning' });
            }
        },
        closeCatalog1(f){
            if(f){
                this.getDataList();
                this.catalogKeyArr = [];
            }
            this.isShow = 0;

            this.isCatalog = false;
        },
        closeCatalog(f){
            if(f){
                this.getDataList();
                this.catalogKeyArr = [];
            }
            this.isShow = 0;

            this.isAttachment = false;
        },
        openDetail({row}){
            this.isShow = 1;
            this.isCatalog = true;
            this.gid = row._key;
        },
        openAttachment({row}){
            this.isShow = 2;
            this.isAttachment = true;
            this.gid = row._key;
        },
        openCheck({row}){
            this.isShow = 4;
            this.gid = row._key;
        },
        openLog({row}){
            this.isShow = 3;
            this.gid = row._key;
        },
        async getDataList(){
            this.loading = true;
            this.tableData = [];
            this.pages = 0;
            this.total = 0;
            let result = await api.getAxios('catalog/toBeDiscussedGC?siteKey='+this.stationKey+'&sortField='+this.sortField+'&sortType='+this.sortType+'&orgKey='+this.orgKey+'&type='+this.type+'&gcKey='+this.gcKey+'&surname='+this.surname+'&genealogyName='+this.genealogyName+'&publish='+this.publish+'&fileName='+this.fileName+'&Filenames='+this.Filenames+'&isOverTime='+this.isOverTime+'&page='+this.page+'&limit='+this.limit);
            this.loading = false;
            if(result.status == 200){
                result.result.list.map((item)=>{
                    item.GCOverO = item.GCOver == 1 ? '已完结' : '未完结';
                    item.NoIndexO = item.NoIndex == 1 ? '不可索引' : '可索引';
                    item.gcStatusO = item.gcStatus ? this.catalogStatusO[item.gcStatus] : '';
                    item.updateTimeO = item.updateTime ? ADS.getLocalTime(item.updateTime) : '';
                    item.orgUpdateTimeO = item.orgUpdateTime ? ADS.getLocalTime(item.orgUpdateTime) : '';
                    item.createTimeO = item.createTime ? ADS.getLocalTime(item.createTime) : '';
                    if(item.gcStatus == 23){// 待议复审
                        if(this.roleType == 'host'){
                            item.countdown = item.orgUpdateTime ? (7 - ADS.getSurplusDays(item.orgUpdateTime)) : ''; // 倒计时 以 档案时间 7
                        }
                    }
                    if(item.gcStatus == 20 || item.gcStatus == 25){// 待议谱
                        item.countdown = item.Filetimes ? (90 - ADS.getSurplusDays(item.Filetimes)) : ''; // 倒计时 以 档案时间 90
                    }
                    item.overTime = item.updateTime ? 30 - (new Date(new Date().setHours(0,0,0,0)) - new Date(new Date(item.updateTime).setHours(0,0,0,0)))/24/3600/1000 : item.createTime ? 30 - (new Date(new Date().setHours(0,0,0,0)) - new Date(new Date(item.createTime).setHours(0,0,0,0)))/24/3600/1000 : '';
                    item.Filetimes = ADS.getLocalTime(item.createTime, '/', 1) || item.Filetimes;
                });
                this.tableData = result.result.list;
                this.pages = result.result.pageNum;
                this.total = result.result.total;
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' })
            }
        },
        handlePageChange({ currentPage, pageSize }){
            this.page = currentPage;
            this.getDataList();
        },
        async getOrgList(){// 机构列表
            let data = await api.getAxios('org?siteKey='+this.stationKey+'&name=');
            if(data.status == 200){
                this.orgList = data.data.map((ele, index)=>{
                    return {'label': ele.organizationNo+'('+ele.name+')', 'value': ele._key};
                });
                this.orgList.unshift({'label': '全部供应商', 'value': ''});
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' });
            }
        },
        checkboxChange({records}){
            let catalogKeyArr = [];
            records.forEach((ele) => {
                catalogKeyArr.push(ele._key);
            });
            this.catalogKeyArr = catalogKeyArr;
        },
        async checkCatalogArr(codeSubmit){
            if(!this.catalogKeyArr.length){
                return this.$XModal.message({message: '请勾选可拍家谱', status: 'warning'});
            }
            if(confirm('确认要批量做此操作吗？')){
                this.changeLoading();
                let result = await api.patchAxios('v3/review/catalog/checkBatch', {'catalogKeyArr': this.catalogKeyArr, 'codeSubmit': codeSubmit, 'userKey': this.userId, 'siteKey': this.stationKey});
                this.changeLoading(false);
                if(result.status == 200){
                    this.getCheckLogCodeSubmit();
                }else{
                    this.$XModal.message({ message: result.msg, status: 'warning' })
                }
            }
        },
        async checkCatalog(catalogKey, codeSubmit){
            this.changeLoading();
            let result = await api.patchAxios('v3/review/catalog/check', {'catalogKey': catalogKey, 'codeSubmit': codeSubmit, 'userKey': this.userId, 'siteKey': this.stationKey});
            this.changeLoading(false);
            if(result.status == 200){
                this.getCheckLogCodeSubmit();
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' })
            }
        },
        changeLoading(flag = true){
            this.$store.dispatch('setPropertyValue',{'property':'loading','value': flag});
        },
        activeCellMethod({row,column}){//控制编辑
            return false;
        },
        editClosedEvent({row}){
            
        },
        cellClickEvent({row,column}){
            if(column.property == 'action'){
                return false;
            }
            if(column.property == 'checkbox'){
                return false;
            }
            if(column.property == 'action' || column.property == 'willIn' || column.property == 'annex' || column.property == 'delete' || column.property == 'needFill' || column.property == 'needImage'){
                this.row = {};
            }else{
                this.row = row;
            }
        },
        rowClassName ({ row, rowIndex }) {
            
        },
        cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }){
            if(row.updateKeyArray && row.updateKeyArray.indexOf(column.property) > -1){
                return 'row-red'
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
            catalogStatusO: state => state.nav.catalogStatusO,
            pathname: state => state.nav.pathname,
            roleType: state => state.nav.roleType,
        })
    },
    watch:{
        'isOverTime': function(nv, ov){
            if(nv == '0' || nv == '1'){
                this.actionData = [
                    {'label': '补充','value': 'attachment'},
                    {'label': '编辑','value': 'detail'}, 
                    {'label': '记录','value': 'log'}, 
                    {'label': '快捷查询', 'value': 'singleQuick'},
                ];
            }
            if(this.role >= 1 && this.role <= 3){
                if(nv == '2'){
                    this.actionData = [
                        {'label': '审核','value': 'attachment'},
                        {'label': '编辑','value': 'detail'}, 
                        {'label': '记录','value': 'log'}, 
                        {'label': '快捷查询', 'value': 'singleQuick'},
                    ];
                }else{
                    this.actionData = [
                        {'label': '补充','value': 'attachment'},
                        // {'label': '编辑','value': 'detail'}, 
                        {'label': '记录','value': 'log'}, 
                        {'label': '快捷查询', 'value': 'singleQuick'},
                    ];
                }
            }else{
                if(nv == '0'){
                    this.actionData = [
                        {'label': '补充','value': 'attachment'},
                        {'label': '编辑','value': 'detail'}, 
                        {'label': '记录','value': 'log'}, 
                        {'label': '快捷查询', 'value': 'singleQuick'},
                    ];
                }else{
                    this.actionData = [
                        // {'label': '补充','value': 'attachment'},
                        // {'label': '编辑','value': 'detail'}, 
                        {'label': '记录','value': 'log'}, 
                        {'label': '快捷查询', 'value': 'singleQuick'},
                    ];
                }
            }
            this.getDataList();
        }
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
    .wrap-box{
        position: relative;
        width: 100%;
        height: 100%;
        background: #EFF1F5;
        z-index: 10;
    }
    .head-wrap{
        position: relative;
        width: calc(100% - 40px);
        height: 50px;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .head-left{
            position: relative;
            display: flex;
            align-items: center;
        }
        .condition{
            top: 35px;
        }
    }
    .search-wrap{
        position: relative;
        width: calc(100% - 40px);
        height: 50px;
        padding: 0 20px;
        display: flex;
        align-items: center;
    }
    .content{
        position: relative;
        width: 100%;
        height: calc(100% - 100px);
    }
}
.width150{
    width: 150px;
}
.marginR10{
    margin-right: 10px;
}
.page-wrap{
    position: relative;
    display: flex;
    padding-left: 20px;
    justify-content: space-between;
    align-items: center;
}
.adai-wrap{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,0.3);
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 100;
    &.active{
        z-index: 100;
        justify-content: space-between;
    }
    &.isSimplePath{
        z-index: 100;
    }
}
.drag1{
    left: 50px;
    transform: translate(0, -50%);
}
.drag2{
    transform: translate(0, -50%);
}
</style>

