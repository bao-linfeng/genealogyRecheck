<template>  
    <div class="wrap">
        <Sidebar />
        <div class="content">
            <div class="nav-wrap">
                <span class="title">影像审核-任务详情</span>
            </div>
            <div class="content-wrap">
                <h3>谱目信息</h3>
                <vxe-table
                    class="table-scrollbar"
                    border
                    resizable
                    stripe
                    keep-source
                    show-overflow
                    highlight-hover-row
                    :loading="loading"
                    ref="xTable"
                    :height="105"
                    :align="'center'"
                    :data="tableData">
                    <vxe-table-column field="_key" title="ID"></vxe-table-column>
                    <vxe-table-column field="genealogyName" title="资料名"></vxe-table-column>
                    <vxe-table-column field="place" title="谱籍地"></vxe-table-column>
                    <vxe-table-column field="volume" title="应有卷数"></vxe-table-column>
                    <vxe-table-column field="actualVolumes" title="实拍卷数"></vxe-table-column>
                    <vxe-table-column field="totalPages" title="实拍页数"></vxe-table-column>
                    <vxe-table-column field="submitTimeO" title="提交时间"></vxe-table-column>
                    <vxe-table-column field="checkDoneTimeO" title="剩余天数"></vxe-table-column>
                    <vxe-table-column field="clientUser" title="提交机构"></vxe-table-column>
                    <vxe-table-column v-if="(role >= 1 && role <= 3) || orgAdmin == 'admin'" title="操作" width="180" :cell-render="{name:'AdaiActionButton',attr:{data:[{'label': '审核通过', 'value': 'submit'},{'label': '打回', 'value': 'verify'}]},events:{'submit': taskVerifyPass, 'verify': taskVerifyReturn}}"></vxe-table-column>
                </vxe-table>
            </div>
            <div class="vex-table-box">
                <h3>卷册信息({{volumeData.length}})</h3>
                <vxe-table
                    class="table-scrollbar"
                    border
                    resizable
                    stripe
                    keep-source
                    show-overflow
                    highlight-hover-row
                    :loading="loading"
                    ref="xTable"
                    :height="h"
                    :align="'center'"
                    :data="volumeData">
                    <vxe-table-column field="_key" title="ID"></vxe-table-column>
                    <vxe-table-column field="volume" title="卷册"></vxe-table-column>
                    <vxe-table-column field="beginTimeO" title="开拍时间"></vxe-table-column>
                    <vxe-table-column field="takePages" title="实拍页数"></vxe-table-column>
                    <vxe-table-column field="doneTimeO" title="拍完时间"></vxe-table-column>
                    <vxe-table-column field="submitStatus" title="审核状态"></vxe-table-column>
                    <vxe-table-column field="returnReason" title="打回原因"></vxe-table-column>
                    <vxe-table-column title="操作" width="160" :cell-render="{name:'AdaiActionButton',attr:{data:[{'label': '审核', 'value': 'volumeLook'}, {'label': '打回', 'value': 'volumeReturn'}]},events:{'volumeLook': lookEvent, 'volumeReturn': volumeReturnEvent}}"></vxe-table-column>
                </vxe-table>
                <vxe-pager
                    :loading="loading"
                    :current-page="page"
                    :page-size="limit"
                    :total="total"
                    :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
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
    name: "camearDetail",
    components: {
        Sidebar,NavModal
    },
    data: () => {
        return {
            loading: false,
            tableData: [],
            page: 1,
            limit: 20,
            total: 0,
            volumeData: [],
            catalogKey: '',
            taskdays: 90,
            takeStatus: '',
        };
    },
    created:function(){
        this.h = window.innerHeight - 60 - 150 - 48 - 25;
        this.catalogKey = ADS.getQueryVariable('key');
    },
    mounted:function(){
        this.getTaskDetail();
        this.getVolumeList();
    },
    methods:{
        async getTaskDetail(){// 任务详情
            this.loading = true;
            let data = await api.getAxios('review/task/detail?catalogKey='+this.catalogKey);
            this.loading = false;
            if(data.status == 200){
                this.takeStatus = data.data.takeStatus;
                data.data.clientUser = data.data.deviceInfo ? data.data.deviceInfo.clientUser : '';
                data.data.submitTimeO = data.data.submitTime ? ADS.getLocalTime(data.data.submitTime) : '';
                data.data.checkDoneTimeO = data.data.checkDoneTime ? (this.taskdays - ADS.getSurplusDays(data.data.checkDoneTime)) : '';
                this.tableData =  [data.data];
            }else{
                this.$XModal.message({message: data.msg, status: 'warning'})
            }
        },
        async getVolumeList(){// 卷册列表
            this.loading = true;
            let result = await api.getAxios('review/volume/list?catalogKey='+this.catalogKey);
            this.loading = false;
            if(result.status == 200){
                let O = {1: '待审核', 2: '通过', 3: '打回'};
                result.data.forEach((ele, i) => {
                    ele.volume = i + 1;
                    ele.beginTimeO = ADS.getLocalTime(ele.beginTime);
                    ele.doneTimeO = ADS.getLocalTime(ele.doneTime);
                    ele.submitStatus = O[ele.reviewStatus];
                });
                this.volumeData = result.data;
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        taskVerifyPass(){
            this.$confirm('确认进行此操作, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.taskVerify('pass');
            }).catch(() => {});
        },
        taskVerifyReturn(){
            this.$confirm('确认进行此操作, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.taskVerify('return');
            }).catch(() => {});
        },
        async taskVerify(operate){// 任务 通过、打回
            let result = await api.patchAxios('review/task/verify', {'catalogKey': this.catalogKey, 'operate' : operate, 'returnReason': '', 'userKey': this.userId} , false);
            if(result.status == 200){
                this.$router.push('/'+window.localStorage.getItem('pathname')+'/takeCamera?i='+(operate == 'return' ? '4' : this.takeStatus == 12 ? '3' : '5'));
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        volumeReturnEvent({row}){
            if(row.reviewStatus == 1){
                this.$confirm('确认打回该卷册吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.volumeReturn({row});
                }).catch(() => {});
            }else{
                this.$XModal.message({message: '您无权操作', status: 'warning'});
            }
        },
        async volumeReturn({row}){// 卷册打回
            let result = await api.patchAxios('review/volume/return', {'volumeKey': row._key, 'userKey': this.userId, 'orgOrFS': this.takeStatus == 12 ? 1 : 2} , false);
            if(result.status == 200){
                this.getVolumeList();
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        lookEvent({row}){
            if(row.reviewStatus == 1){
                this.$router.push('/'+window.localStorage.getItem('pathname')+'/cameraImage?vid='+row._key+'&takeStatus='+this.takeStatus);
            }else{
                this.$XModal.message({message: '您无权操作', status: 'warning'});
            }
        },
        handlePageChange({ currentPage, pageSize }){
            this.page = currentPage;
            this.getVolumeList();
        },
    },
    computed: {
        ...mapState({
            TOKEN: state => state.nav.TOKEN,
            userName: state => state.nav.userName,
            userId: state => state.nav.userId,
            stationKey: state => state.nav.stationKey,
            role: state => state.nav.role,
            pathname: state => state.nav.pathname,
            orgAdmin: state => state.nav.orgAdmin,
        })
    },
    watch:{
        
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
        .nav-wrap{
            position: relative;
            width: calc(100% - 40px);
            padding: 0 20px;
            height: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title{
                font-weight: bold;
            }
        }
        .content-wrap{
            position: relative;
            width: calc(100% - 40px);
            padding: 10px 20px;
        }
        .vex-table-box{
            width: calc(100% - 40px);
            padding: 0 20px;
            height: calc(100% - 235px);
        }
    }
}
</style>

