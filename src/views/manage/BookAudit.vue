<template>  
    <div class="wrap">
        <Sidebar />
        <div class="content">
            <NavModal :title="'新谱查重'+(total ? '('+total+')' : '')">
                <div class="toolbar">
                    <!-- <vxe-button v-if="role >= 1 && role <= 3" content="删除脏数据" @click="removeSigleEvent({'row':{'hasMarkISGN':1,'batchID':''}})"></vxe-button> -->
                </div>
            </NavModal>
            <div class="select-wrap">
                <el-select class="w150" v-model="type" placeholder="请选择类型">
                    <el-option
                        v-for="item in dataType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker
                    class="w250"
                    v-model="time"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                />
                <el-select class="w150" v-model="libListCheck" multiple placeholder="请选择机构">
                    <el-option
                        v-for="item in libList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select class="w150" v-model="stage" placeholder="风控决策阶段">
                    <el-option
                        v-for="item in stageArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-if="stage == 'hasSubmit'" class="w150" v-model="claimUserKey">
                    <el-option
                        v-for="item in claimUserList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-input class="w150" v-model="fileName" placeholder="文件标题"></el-input>
                <el-button type="primary" @click="refresh">检索</el-button>
            </div>
            <div class="vex-table-box">
                <el-table
                    ref="table"
                    :loading="loading"
                    :data="tableData"
                    :height="h"
                    @sort-change="sortChangeEvent"
                    border
                    style="width: 100%">
                    <el-table-column prop="fileName" label="文件标题" min-width="180" align="center"></el-table-column>
                    <el-table-column prop="status" label="状态" width="100" align="center"></el-table-column>
                    <el-table-column prop="dataNum" label="已导入数" width="120" align="center"></el-table-column>
                    <el-table-column prop="hasMarkISGNNum" label="已入库数" width="120" align="center"></el-table-column>
                    <el-table-column prop="toBeDiscussedNumber" label="待议数" width="100" align="center"></el-table-column>
                    <el-table-column prop="duplicateNumber" label="重复数" width="100" align="center"></el-table-column>
                    <el-table-column prop="invalidNumber" label="无效数" width="100" align="center"></el-table-column>
                    <el-table-column prop="cancelNumber" label="作废数" width="100" align="center"></el-table-column>
                    <el-table-column prop="lib" label="来源" width="100" align="center" sortable="custom"></el-table-column>
                    <el-table-column prop="checkUserName" label="审核人" width="100" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="导入时间" width="160" align="center" sortable="custom"></el-table-column>
                    <el-table-column
                        label="操作"
                        width="300"
                        align="center">
                        <template slot-scope="scope" v-if="scope.row.fileName != '本页小计'">
                            <button v-if="!scope.row.claimUserKey && scope.row.status == '提交审核'" class="AdaiActionButton" @click="claimBatch(scope.row)">认领</button>
                            <button v-if="((scope.row.claimUserKey == userId || (scope.row.claimUserKey && ['9071165200'].indexOf(roleKey) > -1)) && scope.row.status == '提交审核') || scope.row.status != '提交审核'" class="AdaiActionButton" @click="navTo(scope.row)">查看</button>
                            <button class="AdaiActionButton" @click="downloadExcel(scope.row)">Excel(修正)</button>
                            <button class="AdaiActionButton" @click="downloadNaturalExcel(scope.row)">Excel(原始)</button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <vxe-table
                    class="table-scrollbar"
                    :loading="loading"
                    border
                    resizable
                    stripe
                    keep-source
                    show-overflow
                    highlight-hover-row
                    ref="xTable"
                    :height="h"
                    :align="'center'"
                    :data="tableData"
                    :sort-config="{trigger: 'cell', orders: ['desc', 'asc', 'auto'], remote: true}"
                    @sort-change="sortChangeEvent"
                    >
                    <vxe-table-column field="fileName" title="文件标题" width="180"></vxe-table-column>
                    <vxe-table-column field="status" title="状态"></vxe-table-column>
                    <vxe-table-column field="dataNum" title="已导入数"></vxe-table-column>
                    <vxe-table-column field="hasMarkISGNNum" title="已入库数"></vxe-table-column>
                    <vxe-table-column field="toBeDiscussedNumber" title="待议数"></vxe-table-column>
                    <vxe-table-column field="duplicateNumber" title="重复数"></vxe-table-column>
                    <vxe-table-column field="invalidNumber" title="无效数"></vxe-table-column>
                    <vxe-table-column field="cancelNumber" title="作废数"></vxe-table-column>
                    <vxe-table-column field="libO" title="来源" sort-by="libCode" sortable></vxe-table-column>
                    <vxe-table-column field="checkUserName" title="审核人"></vxe-table-column>
                    <vxe-table-column field="createTime" title="导入时间" :formatter="['formatDate', '']" sort-by="createTime" sortable></vxe-table-column>
                    <vxe-table-column title="操作" width="260" :cell-render="{name:'AdaiActionButton2',attr:{data:actionData},events:{'look':navTo,'download': downloadExcel, 'downloadNaturalExcel': downloadNaturalExcel}}"></vxe-table-column>
                </vxe-table> -->
                <vxe-pager
                    :loading="loading"
                    :current-page="page"
                    :page-size="pages"
                    :total="total"
                    :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Total']"
                    @page-change="handlePageChange">
                </vxe-pager>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import Sidebar from "../../components/sidebar/Sidebar.vue";
import NavModal from "../../components/dictionary/NavModal.vue";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "bookAudit",
    components: {
        Sidebar,NavModal
    },
    data: () => {
        return {
            type:'',
            tableData: [],
            stage: '',
            stageArr: [
                {'label':'全部状态','value':''},
                // {'label':'已提交未审核','value':'unAudit'},
                {'label':'提交审核','value':'hasSubmit'},
                // {'label':'打回','value':'needReview'},
                {'label':'审核通过','value':'hasPast'}
            ],
            batchId: '',
            batchArr:[],
            stageState:[{'label':'√','value':1},{'label':'','value':null},{'label':'','value':0}],
            actionData:[
                {'label':'查看','value':'look'},
                {'label':'Excel(修正)','value':'download'},
                {'label':'Excel(原始)','value':'downloadNaturalExcel'}
            ],
            page: 1,
            pages: 50,
            total:0,
            userList:[],
            userKey:'',
            loading: false,
            dataType: [],
            libList: [],
            libListCheck: [],
            time: '',
            startTime: '',
            endTime: '',
            fileName: '',
            sortField: '', 
            sortType: 'auto',
            claimUserList: [],
            claimUserKey: '',
        };
    },
    created:function(){
        let search = window.location.search,param=ADS.params(search);
        this.h = window.innerHeight - 132 - 48;
        this.type = ADS.getQueryVariable('type') ? decodeURIComponent(ADS.getQueryVariable('type')) : '';
        this.fileName = ADS.getQueryVariable('fileName') ? decodeURIComponent(ADS.getQueryVariable('fileName')) : '';
        this.libListCheck = ADS.getQueryVariable('libListCheck') ? ADS.getQueryVariable('libListCheck').split(',') : '';
        this.startTime = ADS.getQueryVariable('startTime');
        this.endTime = ADS.getQueryVariable('endTime');
        this.stage = ADS.getQueryVariable('stage') || 'hasSubmit';
        this.page = ADS.getQueryVariable('page') ? Number(ADS.getQueryVariable('page')) : 1;
    },
    mounted:function(){
        this.role <= 3 && this.role >= 1 ? this.getUserList() : null;
        this.getDataType();
        this.getBatchList(); 
        this.getLibList();
        this.getBatch(false);
        this.getClaimUserList();
    },
    methods:{
        async claimBatch(row){//认领
            let result = await api.patchAxios('batch/claim',{
                'batchKey': row._key,
                'claimUserKey': this.userId
            });
            if(result.status == 200){
                this.getBatch(false);
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' })
            }
        },
        async getClaimUserList(){
            let result = await api.getAxios('batch/claimUserList');
            if(result.status == 200){
                let claimUserList = [{'label': '认领人', 'value': ''}];
                result.data.map((item)=>{
                    claimUserList.push({'label': item.userName, 'value': item._key});
                });
                this.claimUserList = claimUserList;
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' })
            }
        },
        sortChangeEvent({column, prop, order}){
            console.log(column, prop, order);
            this.sortField = prop || '';
            this.sortType = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : '';
            this.refresh();
        },
        // sortChangeEvent({column, property, order, sortBy, sortList, $event}){
        //     console.log(property, order, sortBy);
        //     this.sortField = sortBy;
        //     this.sortType = order;
        //     this.refresh();
        // },
        async downloadExcel(row){//下载excel
            let data = await api.postAxios('data/feedbackMark',{'batchKey':row._key});
            if(data.status == 200){
                ADS.downliadLink(data.result);
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        downloadNaturalExcel(row){
            console.log(row);
            if(row.uploadOriginalFileName){
                window.open(this.baseURL+'catalogFile/'+row.uploadOriginalFileName);
            }else{
                ADS.message('暂无原始Excel!');
            }
        },
        async getLibList(){
            let data = await api.getAxios('lib?siteKey='+this.stationKey);
            if(data.status == 200){
                let libList = [{'label':'全部机构','value':''}];
                data.data.map((item)=>{
                    libList.push({'label': item.libName+'('+item.libCode+')','value': item._key});
                });
                this.libList = libList;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        removeSigleEvent({row}){// 删除批次所有脏数据确认函数
            if(row.hasMarkISGN != 1){
                this.$XModal.message({ message: '该批次数据还没有入库，暂时无法删除脏数据', status: 'warning' });
                return false;
            }
            this.$confirm('此操作将永久删除该批次所有脏数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.removeBatchDirtyData(row.batchID);
            }).catch(() => {});
        },
        async removeBatchDirtyData(batchID){// 删除脏数据
            let data = await api.deleteAxios('dirty',{'batchKey':batchID,'siteKey':this.stationKey});
            if(data.status == 200){
                data.data && data.data.length ? this.$XModal.message({ message: (data.data.join(',')+'等批次未删除'), status: 'success' }) : null;
                this.getBatch();
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        getDataType:async function(){
            let data=await api.getAxios('dataType');
            if(data.status == 200){
                let dataType = [{'label':'全部','value':''}];
                data.data.map((item)=>{dataType.push({'label':item.showName,'value':item.type})});
                this.dataType = dataType;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        navTo(row){
            let state = 0;
            row.hasClean ? state = 1 : null;
            row.hasCheckInBatch ? state = 2 : null;
            row.hasCheckInISGN ? state = 3 : null;
            row.hasSubmit ? state = 4 : null;
            row.hasPast ? state = 5 : null;
            this.$router.push('/'+window.localStorage.getItem('pathname')+'/bookAuditList?batchID='+row._key+'&state='+state+'&f='+encodeURIComponent(row.fileName));
        },
        refresh(){// 刷新
            if(this.fileName){
                this.stage = '';
            }
            this.page = 1;
            this.getBatch();
        },
        getUserList:async function(){// 上传者
            let data=await api.getAxios('site/dataUser?siteKey='+this.stationKey);
            if(data.status && data.result){
                let userList = [{'label':'全部操作员','value':''}];
                data.result.map((item)=>{
                    userList.push({'label':item.userName,'value':item._key});
                });
                this.userList = userList;
            }
        },
        getBatchList:async function(){// 批次号列表
            let data=await api.getAxios('batch/simple?siteKey='+this.stationKey+'&userKey='+this.userKey);
            if(data.status == 200){
                let batchArr = [{'label':'全部批次','value':''}];
                data.data.map((item)=>{batchArr.push({'label':item.batchID,'value':item._key})});
                this.batchArr = batchArr;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        handlePageChange({ currentPage, pageSize }){
            console.log(currentPage);
            this.page = currentPage;
            this.getBatch();
        },
        async getBatch(f = true){// 批次列表
            f ? this.$router.push('/'+window.localStorage.getItem('pathname')+'/bookaudit?type='+this.type+'&fileName='+this.fileName+'&libListCheck='+this.libListCheck.join()+'&startTime='+this.startTime+'&endTime='+this.endTime+'&stage='+this.stage+'&page='+this.page) : null;
            this.loading = true
            let data=await api.getAxios('batch?type='+this.type+'&claimUserKey='+this.claimUserKey+'&sortField='+this.sortField+'&sortType='+this.sortType+'&fileName='+this.fileName+'&libListCheck='+this.libListCheck.join()+'&startTime='+this.startTime+'&endTime='+this.endTime+'&batchKey='+this.batchId+'&siteKey='+this.stationKey+'&stage='+this.stage+'&userKey='+this.userId+'&creator='+this.userKey+'&userRole='+this.role+'&page='+this.page+'&limit='+this.pages);
            if(data.status == 200){
                let excelDataNum = 0, dataNum = 0, hasMarkISGNNum = 0, toBeDiscussedNumber = 0,  duplicateNumber = 0, invalidNumber = 0, cancelNumber = 0, arr = [];
                this.tableData = data.data.map((ele) => {
                    ele.lib = ele.lib+'('+ele.libCode+')';
                    excelDataNum = excelDataNum + ele.excelDataNum;
                    dataNum = dataNum + ele.dataNum;
                    hasMarkISGNNum = hasMarkISGNNum + ele.hasMarkISGNNum;
                    toBeDiscussedNumber = toBeDiscussedNumber + ele.toBeDiscussedNumber;
                    duplicateNumber = duplicateNumber + ele.duplicateNumber;
                    invalidNumber = invalidNumber + ele.invalidNumber;
                    cancelNumber = cancelNumber + ele.cancelNumber;

                    ele.hasSubmitO = ele.hasSubmit == 1 || (ele.repulseTime ? 1 : 0) || ele.hasPass == 1;
                    ele.needReviewO = ele.needReview == 1 && ele.hasPass != 1 && (ele.repulseTime ? 1 : 0);
                    ele.status = ele.hasPast ? '审核通过' : ele.needReviewO ? '打回' : ele.hasSubmitO ? '提交审核' : '待提交';
                    ele.createTime = ele.createTime ? ADS.getLocalTime(ele.createTime) : '';

                    return ele;
                });
                
                this.tableData.push({
                    'excelDataNum': excelDataNum, 
                    'dataNum': dataNum, 
                    'hasMarkISGNNum': hasMarkISGNNum, 
                    'toBeDiscussedNumber': toBeDiscussedNumber, 
                    'duplicateNumber': duplicateNumber, 
                    'invalidNumber': invalidNumber,
                    'cancelNumber': cancelNumber,
                    'fileName': '本页小计'
                });
                this.total = data.total;
                this.loading = false;
                
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
            sumbmitNum: state => state.nav.sumbmitNum,
            baseURL: state => state.nav.baseURL,
            roleKey: state => state.nav.roleKey,
        })
    },
    watch:{
        'sumbmitNum': function(nv, ov){
            this.getBatch();
        },
        'time': function(nv, ov){
            if(nv){
                this.startTime = new Date(nv[0]).getTime();
                this.endTime = new Date(nv[1]).getTime();
            }else{
                this.startTime = '';
                this.endTime = '';
            }
        },
        'stage': function(nv, ov){
            if(nv != 'hasSubmit'){
                this.claimUserKey = '';
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
        height: calc(100% - 20px);
        background: #EFF1F5;
        padding-bottom: 20px;
        .select-wrap{
            padding: 10px 20px;
            width: calc(100% - 40px);
            display: flex;
            align-items: center;
            .label{
                margin-right: 20px;
            }
        }
        .vex-table-box{
            width: calc(100% - 40px);
            padding: 0 20px;
            height: calc(100% - 140px);
        }
    }
}
.toolbar{
    display: flex;
    align-items: center;
}
.input{
    width: 150px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #ddd;
    border-radius: 3px;
    text-indent: 10px;
    outline: none;
    margin-right: 10px;
}
.w150{
    width: 150px;
}
.w250{
    width: 250px !important;
}
</style>

