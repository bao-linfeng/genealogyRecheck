<template>  
    <div class="wrap">
        <Sidebar />
        <div class="content">
            <div class="nav-wrap">
                <span class="title">编目待议列表</span>
                <div class="head-right">
                    <!-- <el-button type="primary" size="medium">审核</el-button> -->
                </div>
            </div>
            <div class="search-wrap">
                <el-input class="width100" v-model="gcKey" placeholder="请输入谱ID" size="mini"></el-input>
                <el-input class="width100" v-model="genealogyName" placeholder="请输入谱名" size="mini"></el-input>
                <el-select class="width100" v-if="role >= 1 && role <= 3" v-model="orgKey" placeholder="机构" size="mini">
                    <el-option
                        v-for="item in orgList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select class="width100" v-model="hitTarget" placeholder="命中状态" size="mini">
                    <el-option
                        v-for="item in hitTargetList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select class="width100" v-model="hasVerify" placeholder="审核状态" size="mini">
                    <el-option
                        v-for="item in hasVerifyList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select class="width100" v-model="isBill" placeholder="发票状态" size="mini">
                    <el-option
                        v-for="item in isBillList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                
                <el-button type="primary" size="mini" @click="handleSearch">检索</el-button>
                <el-button v-if="roleType == 'host' && ['9071165200'].indexOf(roleKey) > -1" type="primary" size="mini" @click="billDuplicateGCVolumeDownload">下载</el-button>
                <el-checkbox class="marginL10" size="mini" v-model="isShowSearch">展开</el-checkbox>
            </div>
            <div class="search-wrap" v-show="isShowSearch">
                <el-input class="width100" v-model="updaterName" placeholder="请输入操作人" size="mini"></el-input>
                <el-input class="width100" v-model="verifyUserName" placeholder="请输入审核人" size="mini"></el-input>
                <el-date-picker
                    class="w230"
                    v-model="time"
                    type="daterange"
                    unlink-panels
                    start-placeholder="操作开始时间"
                    end-placeholder="操作结束时间"
                    size="mini"
                />
                <el-date-picker
                    class="w230"
                    v-model="verifyTime"
                    type="daterange"
                    unlink-panels
                    start-placeholder="审核开始时间"
                    end-placeholder="审核结束时间"
                    size="mini"
                />
                <!-- <el-checkbox v-if="roleType == 'host' && ['9071165200'].indexOf(roleKey) > -1" class="marginL10" size="mini" v-model="isDuplicateBill">已开发票且标记重复</el-checkbox> -->
            </div>
            <div class="vex-table-box" :class="{active: isShowSearch}">
                <el-table
                    ref="table"
                    :data="tableData"
                    :height="h"
                    :cell-class-name="cellClassName"
                    @sort-change="sortChangeEvent"
                    border
                    style="width: 100%">
                    <el-table-column fixed="left" prop="gcKey" label="谱ID" width="100" align="center"></el-table-column>
                    <el-table-column fixed="left" prop="genealogyName" label="谱名" width="150" align="center"></el-table-column>
                    <el-table-column fixed="left" prop="surname" label="姓氏" width="50" align="center"></el-table-column>
                    <el-table-column fixed="left" prop="publish" label="出版年" width="100" align="center"></el-table-column>
                    <el-table-column fixed="left" prop="hall" label="堂号" min-width="100" align="center"></el-table-column>
                    <el-table-column prop="firstAncestor" label="一世祖" width="100" align="center"></el-table-column>
                    <el-table-column prop="migrationAncestor" label="始迁祖" width="100" align="center"></el-table-column>
                    <el-table-column prop="LocalityModern" label="谱籍地(原谱)" width="120" align="center"></el-table-column>
                    <el-table-column prop="place" label="谱籍地(现代)" width="120" align="center"></el-table-column>
                    <el-table-column prop="volume" label="卷(册)说明" width="100" align="center"></el-table-column>
                    <el-table-column prop="lostVolume" label="缺卷说明" width="100" align="center"></el-table-column>
                    <el-table-column prop="hasVolume" label="可拍册数" width="100" align="center"></el-table-column>
                    <el-table-column prop="volumeNumber" label="实拍册数" width="100" align="center"></el-table-column>
                    <el-table-column prop="authors" label="作者" width="100" align="center"></el-table-column>
                    <el-table-column prop="authorJob" label="作者职务" width="100" align="center"></el-table-column>
                    <el-table-column prop="Dupbookid" label="重复谱ID" width="100" align="center"></el-table-column>
                    <el-table-column prop="memo" label="备注" width="150" align="center"></el-table-column>
                    <el-table-column prop="explain" label="说明" width="150" align="center"></el-table-column>
                    <el-table-column prop="orgName" label="上传机构" width="100" align="center"></el-table-column>
                    <el-table-column prop="hitTargetNumber" label="命中条数" width="100" align="center"></el-table-column>
                    <el-table-column prop="updaterName" label="操作人" width="100" align="center"></el-table-column>
                    <el-table-column prop="applyTime" label="操作时间" width="120" align="center" sortable="custom"></el-table-column>
                    <el-table-column prop="verifyUserName" label="审核人" width="100" align="center"></el-table-column>
                    <el-table-column prop="verifyTime" label="审核时间" width="120" align="center" sortable="custom"></el-table-column>
                    <el-table-column prop="condition" label="状态" width="120" align="center"></el-table-column>
                    <el-table-column prop="isBillO" label="已开发票" width="120" align="center"></el-table-column>
                    <el-table-column prop="indexAssign" label="索引分配" width="120" align="center"></el-table-column>
                    <!-- <el-table-column prop="isDuplicateO" label="标记重复" width="120" align="center"></el-table-column> -->
                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="200"
                        align="center">
                        <template slot-scope="scope">
                            <button class="AdaiActionButton" v-if="scope.row.hitTargetNumber && roleType == 'host' && ((scope.row.verifyUserKey && ['9071165200'].indexOf(roleKey) > -1 && scope.row.isDuplicate == 1) || (!scope.row.verifyUserKey && '9071165200' != roleKey))" @click="toExamine(scope.row)">审核</button>
                            <!-- <button class="AdaiActionButton" v-if="scope.row.hitTargetNumber && roleType == 'host' && ((scope.row.isBill && scope.row.condition != 'd' && ['9071165200'].indexOf(roleKey) > -1) || (!scope.row.isBill))" @click="editBook(scope.row)">编辑</button> -->
                            <!-- <button v-if="scope.row.hitTargetNumber && roleType == 'host' && scope.row.isBill && '9071165200' != roleKey && !scope.row.isDuplicate" class="AdaiActionButton" @click="handleMark(scope.row)">标记重复谱</button> -->
                            <button class="AdaiActionButton" v-if="scope.row.imageLink || scope.row.volumeNumber" @click="lookImage(scope.row)">影像</button>
                            <button class="AdaiActionButton" @click="lookBook(scope.row)">详情</button>
                            <button class="AdaiActionButton" @click="lookLog(scope.row)">记录</button>
                            <button v-if="scope.row.isBill && scope.row.hitTargetNumber" class="AdaiActionButton" @click="lookInvoice(scope.row)">发票</button>
                            <button v-if="scope.row.hitTargetNumber" class="AdaiActionButton" @click="lookEvent(scope.row)">查重结果</button>
                            <button class="AdaiActionButton" @click="singleQuick(scope.row)">快捷查询</button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-foot">
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
        <!-- <Loading v-show="loading" /> -->
        <RecheckList v-if="showRecheck" :id="checkTaskKey" v-on:close="showRecheck = false" />
        <!-- 查看谱目 -->
        <Drag class="drag1">
            <CatalogView v-if="showDetail" :read="isRead" :dataKey="dataKey" :vid="''" v-on:close="showDetail = false" />
        </Drag>
        <!-- 编目审核 -->
        <ExamineCatalog v-if="showExamine" :dataKey="dataKey" :checkTaskKey="checkTaskKey" v-on:close="closeExamine" />
        <!-- 记录 -->
        <LogModule v-if="isLog == 1" :gid="dataKey" v-on:close="closeLog" />
        <!-- 谱目编辑 -->
        <EditCatalog v-if="isLog == 2" :read="false" :dataKey="dataKey" :conditionEdit="true" :vid="''" v-on:close="closeLog" />
        <!-- 卷册发票列表 -->
        <InvoiceList v-if="isLog == 3" :id="dataKey" v-on:close="isLog = 0" />
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import Sidebar from "../../components/sidebar/Sidebar.vue";
import InvoiceList from '../../components/singleRecheck/InvoiceList.vue';
import RecheckList from '../../components/singleRecheck/RecheckList.vue';
import CatalogView from '../../components/takeCamera/CatalogView.vue';
import ExamineCatalog from '../../components/singleRecheck/ExamineCatalog.vue';
import LogModule from '../../components/discussed/LogModule.vue';
import EditCatalog from '../../components/takeCamera/EditCatalog.vue';
import Drag from '../../components/Drag.vue';
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "singleRecheck",
    components: {
        Sidebar, RecheckList, CatalogView, ExamineCatalog, LogModule, EditCatalog, InvoiceList,
        Drag,
    },
    data: () => {
        return {
            loading: false,
            tableData: [],
            page: 1,
            pages: 0,
            limit: 20,
            total: 0,
            searchField: '',
            searchValue: '',
            genealogyName: '',
            gcKey: '',
            place: '',
            orgList: [],
            orgKey: '',
            hitTarget: '1',
            hitTargetList: [
                {'label': '命中状态', 'value': ''},
                {'label': '命中', 'value': '1'},
                {'label': '未命中', 'value': '2'},
            ],
            hasVerify: '',
            hasVerifyList: [
                {'label': '审核状态', 'value': ''},
                {'label': '未审核', 'value': '0'},
                {'label': '确认不重复', 'value': '1'},
                {'label': '确认重复', 'value': '2'},
            ],
            time: '',
            startTime: '',
            endTime: '',
            h: 0,
            selectRecords: [],
            checkTaskKey: '',
            isShow: 0,
            showRecheck: false,
            showDetail: false,
            isRead: true,
            dataKey: '',
            sortField: '',
            sortType: '',
            updaterName: '',
            verifyUserName: '',
            verifyTime: '',
            verifyStartTime: '',
            verifyEndTime: '',
            showExamine: false,
            isLog: 0,
            checkTaskKey: '',
            isShowSearch: false,
            isDuplicateBill: false,
            isBill: '',
            isBillList: [
                {'label': '发票状态', 'value': ''},
                {'label': '未开发票', 'value': '0'},
                {'label': '已开发票', 'value': '1'},
            ],
        };
    },
    created:function(){
        this.h = window.innerHeight - 50 - 30 - 50;
    },
    mounted:function(){
        if(this.roleType == 'host'){
            if(['9071165200'].indexOf(this.roleKey) > -1){
                this.hasVerify = '2';
            }else{
                this.hasVerify = '0';
            }
        }else{
            this.orgKey = this.orgId;
        }
        this.getOrgList();
        this.getDataList();
    },
    methods:{
        handleSearch(){
            this.page = 1;
            this.getDataList();
        },
        handleMark(row){
            this.$confirm('是否要把 '+row.genealogyName+' 谱目设置为重复谱，会影响已开发票?', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning',
                distinguishCancelAndClose: true
            }).then(() => {
                this.isDuplicateGC(row._key, 1);
            }).catch((e) => {
                console.log(e);
                if(e === 'cancel'){
                    this.isDuplicateGC(row._key, 0);
                }
            });
        },
        async isDuplicateGC(checkTaskKey, isDuplicate){// 是否重复谱确认 isDuplicate 重复 1 是 0 否 baolf 2023.09.05 13:55
            let result = await api.postAxios('data/isDuplicateGC', {
                'checkTaskKey': checkTaskKey,
                'isDuplicate': isDuplicate,
                'userKey': this.userId, 
                'siteKey': this.stationKey,
            });

            if(result.status == 200){
                this.getDataList();
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' });
            }
        },
        async billDuplicateGCVolumeDownload(){
            this.loading = true;
            let data = await api.getAxios('data/billDuplicateGCVolumeDownload?orgKey='+this.orgKey);
            this.loading = false;
            if(data.status == 200){
                ADS.downliadLink(data.result);
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' });
            }
        },
        closeExamine(f){
            this.showExamine = false;
            f ? this.getDataList() : null;
        },
        lookInvoice(row){
            this.dataKey = row.gcKey;
            this.isLog = 3;
        },
        lookImage(row){
            if(row.imageLink){
                window.open(row.imageLink);
            }else{
                window.open('/'+this.pathname+'/cameraImage?device='+row.device+'&vid='+row.volumeKey+'&gid='+row.gcKey+'&genealogyName='+row.genealogyName);
                // window.open('/'+this.pathname+'/viewImage?gid='+row.gcKey+'&genealogyName='+row.genealogyName);
            }
        },
        toExamine(row){
            console.log(row);
            // if(row.verifyUserKey){
            //     return ADS.message('该编目已经审核，不允许重复审核！');
            // }
            this.showExamine = true;
            this.dataKey = row.gcKey;
            this.checkTaskKey = row._key;
        },
        singleQuick( row ){
            window.open('/'+this.pathname+'/singleQuickSearch?id='+row.gcKey, '_blank');
        },
        lookBook( row ){
            this.dataKey = row.gcKey;
            this.showDetail = true;
        },
        lookLog(row){
            this.isLog = 1;
            this.dataKey = row.gcKey;
        },
        editBook(row){// 编辑谱目
            this.dataKey = row.gcKey;
            this.isLog = 2;
        },
        closeLog(f){
            this.isLog = 0;
        },
        sortChangeEvent({column, prop, order}){
            console.log(column, prop, order);
            this.sortField = prop || '';
            this.sortType = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : '';
            this.getDataList();
        },
        rowClassName ({ row, rowIndex }) {
            if(row.isLook){
                return 'row-gray'
            }
        },
        cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }){
            if(row.GCOver == '1' && column.property == 'gcKey') {
                return 'row-blue'
            }
            if(row.changeFieldArr && row.changeFieldArr.indexOf(column.property) > -1){
                return 'row-red';
            }
        },
        selectAllEvent ({ checked, records }) {
            this.selectRecords = records.map((ele) => {
                return ele.volumeKey;
            });
        },
        selectChangeEvent ({ checked, records }) {
            this.selectRecords = records.map((ele) => {
                return ele.volumeKey;
            });
        },
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
        async getDataList(){
            this.loading = true;
            this.tableData = [];
            let data = await api.getAxios('data/checkTaskList?gcKey='+this.gcKey+'&isBill='+this.isBill+'&genealogyName='+this.genealogyName+'&sortField='+this.sortField+'&sortType='+this.sortType+'&hasVerify='+this.hasVerify+'&hitTarget='+this.hitTarget+'&applyStartTime='+this.startTime+'&applyEndTime='+(this.endTime ? this.endTime+24*60*60*1000 - 1 : this.endTime)+'&verifyStartTime='+this.verifyStartTime+'&verifyEndTime='+(this.verifyEndTime ? this.verifyEndTime+24*60*60*1000 - 1 : this.verifyEndTime)+'&orgKey='+this.orgKey+'&page='+this.page+'&limit='+this.limit);
            this.loading = false;
            if(data.status == 200){
                this.tableData = data.result.list.map((ele) => {
                    ele.applyTime = ele.applyTime ? ADS.getLocalTime(ele.applyTime) : '';
                    ele.verifyTime = ele.verifyTime ? ADS.getLocalTime(ele.verifyTime) : '';
                    ele.isBillO = ele.isBill ? '是' : '否';
                    ele.isDuplicateO = ele.isDuplicate ? '是' : '否';
                    ele.indexAssignO = ele.indexAssign ? '已分配' : '未分配';

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
        lookEvent(row){
            this.checkTaskKey = row._key;
            this.showRecheck = true;
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
            isResize: state => state.nav.isResize,
            roleType: state => state.nav.roleType,
            roleKey: state => state.nav.roleKey,
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
        'verifyTime': function(nv, ov){
            console.log(nv);
            if(nv){
                this.verifyStartTime = new Date(nv[0]).getTime();
                this.verifyEndTime = new Date(nv[1]).getTime();
            }else{
                this.verifyStartTime = '';
                this.verifyEndTime = '';
            }
        },
        'isResize': function(nv, ov){
            if(this.isShowSearch){
                this.h = window.innerHeight - 50 - 30 - 50 - 30;
            }else{
                this.h = window.innerHeight - 50 - 30 - 50;
            }
        },
        'isShowSearch': function(nv, ov){
            if(nv){
                this.h = this.h - 30;
            }else{
                this.h = this.h + 30;
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
            height: 30px;
            padding: 0 20px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .vex-table-box{
            width: calc(100% - 40px);
            padding: 0 20px;
            height: calc(100% - 160px);
            &.active{
                height: calc(100% - 160px);
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
}
.width100{
    width: 120px;
}
.marginR10{
    margin-right: 10px;
}
.marginL10{
    margin-left: 10px;
}
.marginB5{
    margin-bottom: 5px;
}
.w230{
    width: 230px !important;
}
</style>

