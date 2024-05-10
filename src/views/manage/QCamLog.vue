<template>  
    <div class="wrap">
        <Sidebar />
        <div class="box">
            <div class="head-box">
                <div class="head-left">
                    <h3 class="title">拍机日志</h3>
                </div>
                <div class="head-right">
                    
                </div>
            </div>
            <div class="search-wrap">
                <div class="search-left">
                    <el-select class="width150" v-model="accountType" size="medium">
                        <el-option
                            v-for="item in accountTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-right">
                    <el-select class="width130" v-model="orgKey" placeholder="供应商">
                        <el-option
                            v-for="item in orgList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-if="accountType <= 2" class="width130" v-model="cameraModel" placeholder="设备型号">
                        <el-option
                            v-for="item in cameraModelList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <label class="label" for="">时间选择</label>
                    <el-date-picker
                        class="width150"
                        v-model="startTime"
                        type="date"
                        size="medium"
                        placeholder="开始日期">
                    </el-date-picker>
                    <el-date-picker
                        class="width150"
                        v-model="endTime"
                        type="date"
                        size="medium"
                        placeholder="结束日期">
                    </el-date-picker>
                    <el-button class="marginL10" type="primary" size="medium" @click="handleSearch">检索</el-button>
                    <el-button v-if="accountType == 1" class="marginL10" type="primary" size="medium" @click="handleSomeDownload">批量下载</el-button>
                </div>
            </div>
            <div class="vex-table-box" v-show="accountType <= 2">
                <el-table
                    v-if="accountTypeO == 1"
                    ref="table1"
                    :data="tableData"
                    :height="h"
                    border
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="time" label="日期" align="center"></el-table-column>
                    <el-table-column prop="supplierOrg" label="供应商" align="center"></el-table-column>
                    <el-table-column prop="userName" label="拍摄人员" align="center"></el-table-column>
                    <el-table-column prop="cameraModel" label="登记设备型号" align="center"></el-table-column>
                    <el-table-column prop="device" label="登记设备序号" align="center"></el-table-column>
                    <el-table-column prop="cameraModelActual" label="拍摄设备型号" align="center"></el-table-column>
                    <el-table-column prop="cameraNumberActual" label="拍摄设备序号" align="center"></el-table-column>

                    <el-table-column prop="imageCount" label="拍数统计" align="center"></el-table-column>
                    <el-table-column prop="imageDelete" label="删除统计" align="center"></el-table-column>
                    <el-table-column prop="volumePages" label="同步拍数" align="center"></el-table-column>

                    <el-table-column prop="cameraLostFocus" label="失焦" align="center"></el-table-column>
                    <el-table-column prop="cameraLost" label="相机断开" align="center"></el-table-column>
                    <el-table-column prop="cameraError" label="拍摄失败" align="center"></el-table-column>
                    <el-table-column
                        label="操作"
                        width="200"
                        align="center">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.time != '合计'" class="marginL10" type="primary" size="small" @click="handleDownload(scope.row)">下载日志</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table
                    v-if="accountTypeO == 2"
                    ref="table2"
                    :data="tableData"
                    :height="h"
                    border
                    style="width: 100%">
                    <el-table-column prop="time" label="日期" align="center"></el-table-column>
                    <el-table-column prop="supplierOrg" label="供应商" align="center"></el-table-column>
                    <el-table-column prop="userName" label="拍摄人员" align="center"></el-table-column>
                    <el-table-column prop="cameraModel" label="设备型号" align="center"></el-table-column>
                    <el-table-column prop="device" label="设备序号" align="center"></el-table-column>
                    <el-table-column prop="cameraLostFocus" label="失焦" align="center"></el-table-column>
                    <el-table-column prop="cameraLost" label="相机断开" align="center"></el-table-column>
                    <el-table-column prop="cameraError" label="拍摄失败" align="center"></el-table-column>
                </el-table>
                <vxe-pager
                    :loading="loading"
                    :current-page="page"
                    :page-size="limit"
                    :total="total"
                    :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Total']"
                    @page-change="handlePageChange">
                </vxe-pager>
            </div>
            <div class="vex-table-box" v-show="accountType == 3">
                <div id="adai-chart"></div>
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
    name: "workloadAccount",
    components: {
        Sidebar, NavModal,
    },
    data: () => {
        return {
            h: 0,
            tableData: [],
            accountType: '1',
            accountTypeO: '1',
            accountTypeList: [
                {'label': '拍摄情况', 'value': '1'},
                // {'label': '出错率', 'value': '2'},
                {'label': '上线情况', 'value': '3'},
                // {'label': '日志下载', 'value': '4'},
            ],
            startTime: '',
            endTime: '',
            isShow: 0,
            orgKey: '',
            orgList: [],
            cameraModel: '',
            cameraModelList: [
                {'label': '全部型号', 'value': ''},
                {'label': 'NikonD800E', 'value': 'D800'},
                {'label': 'NikonD810', 'value': 'D810'},
                {'label': 'NikonD850', 'value': 'D850'},
            ],
            loading: false,
            page: 1,
            limit: 30,
            total: 0,
            dom: '',
            adaiChart: '',
            downloadList: [],
        };
    },
    created:function(){
        this.h = window.innerHeight - 120 - 50;
        this.endTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
        this.startTime = this.endTime - 30*24*60*60*1000;
    },
    mounted:function(){
        this.dom = document.getElementById('adai-chart');
        this.getOrgList();
        this.handleSearch();
    },
    beforeDestroy: function(){
        this.adaiChart ? this.adaiChart.dispose() : null;
    },
    methods:{
        handleSomeDownload(){
            if(!this.downloadList.length){
                return ADS.message('请勾选拍机日志!');
            }

            ADS.zipFiles('拍机日志-'+Date.now()+'.zip', this.downloadList);
            this.handleSearch();
        },
        handleSelectionChange(records){
            console.log(records);
            let downloadList = [];
            records.forEach(ele => {
                if(ele.time != '合计'){
                    downloadList.push({'name': ele.originalName, 'url': api.APIURL+ele.simplePath});
                }
            });
            this.downloadList = downloadList;
        },
        async getCameraLogin(){
            let result = await api.getAxios('v2/camera/device/cameraLogOnline?orgKey='+this.orgKey+'&startTime='+new Date(this.startTime).getTime()+'&endTime='+(new Date(this.endTime).getTime() + 24*60*60*1000 - 1));
            if(result.status == 200){
                let chartData = {
                    'labels': [], 
                    'data': [], 
                    'label': ['上线情况']
                }, a = [
                    {
                        name: '仰沁',
                        data: []
                    },
                    {
                        name: '古中山',
                        data: []
                    },
                    {
                        name: '寻源堂',
                        data: []
                    },
                    {
                        name: '成蹊',
                        data: []
                    },
                    {
                        name: '时光科技',
                        data: []
                    },
                    {
                        name: '良友科苑',
                        data: []
                    },
                    {
                        name: '馨里有谱',
                        data: []
                    },
                ];
                
                result.data.forEach((e) => {
                    chartData.labels.push(e.time);
                    a[0].data.push(e[a[0].name]);
                    a[1].data.push(e[a[1].name]);
                    a[2].data.push(e[a[2].name]);
                    a[3].data.push(e[a[3].name]);
                    a[4].data.push(e[a[4].name]);
                    a[5].data.push(e[a[5].name]);
                    a[6].data.push(e[a[6].name]);
                });
                chartData.data = a;

                this.initChart(chartData);
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        initChart(chartData){
            this.adaiChart ? this.adaiChart.dispose() : null;
            this.adaiChart = null;

            chartData.data.forEach((ele) => {
                ele.type = 'bar';
                ele.stack = 'Ad';
                ele.emphasis = {
                    focus: 'series'
                };
            });

            this.adaiChart = echarts.init(this.dom, null, {
                renderer: 'canvas',
                useDirtyRect: false
            });

            let option = {
                title: {
                    // text: '拍摄机器上线情况',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    // data: chartData.label,
                    // y: 30
                },
                grid: {
                    left: '0%',
                    right: '0%',
                    bottom: '0%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    data: chartData.labels
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: true,
                        lineStyle: {
                            // color: ''
                        }
                    },
                },
                series: chartData.data
            };

            if (option && typeof option === 'object') {
                this.adaiChart.setOption(option);
            }

            window.addEventListener('resize', this.adaiChart.resize);
        },
        handleSearch(){
            this.downloadList = [];
            this.accountType == 1 ? this.getCameraLogList() : null;
            this.accountType == 2 ? this.getCameraLogListError() : null;
            this.accountType == 3 ? this.getCameraLogin() : null;
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
        handlePageChange({ currentPage }){
            this.tableData = [];
            this.page = currentPage;
            this.handleSearch();
        },
        async getCameraLogList(){// 获取拍机日志列表
            this.loading = true;
            this.tableData = [];
            let result = await api.getAxios('v2/camera/device/cameraLogList?supplyOrgKey='+this.orgKey+'&cameraModel='+this.cameraModel+'&startTime='+new Date(this.startTime).getTime()+'&endTime='+(new Date(this.endTime).getTime() + 24*60*60*1000 - 1)+'&page='+this.page+'&limit='+this.limit);
            this.loading = false;
            if(result.status == 200){
                let imageCount = 0, imageDelete = 0, volumePages = 0;
                this.tableData = result.result.list.map((ele)=>{
                    imageCount = imageCount + ele.imageCount;
                    imageDelete = imageDelete + ele.imageDelete;
                    volumePages = volumePages + ele.volumePages;
                    ele.time = ele.date1.replace(/_/g, '/');

                    return ele;
                });
                this.tableData.push({
                    'time': '合计',
                    'imageCount': imageCount,
                    'imageDelete': imageDelete,
                    'volumePages': volumePages,
                });
                this.total = result.result.total;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        async getCameraLogListError(){// 获取拍机日志列表（出错率）
            this.loading = true;
            this.tableData = [];
            let result = await api.getAxios('v2/camera/device/cameraLogListError?supplyOrgKey='+this.orgKey+'&cameraModel='+this.cameraModel+'&startTime='+new Date(this.startTime).getTime()+'&endTime='+(new Date(this.endTime).getTime() + 24*60*60*1000 - 1)+'&page='+this.page+'&limit='+this.limit);
            this.loading = false;
            if(result.status == 200){
                let cameraLostFocus = 0, cameraLost = 0, cameraError = 0;
                this.tableData = result.result.list.map((ele)=>{
                    cameraLostFocus = cameraLostFocus + ele.cameraLostFocus;
                    cameraLost = cameraLost + ele.cameraLost;
                    cameraError = cameraError + ele.cameraError;
                    ele.time = ele.date1.replace(/_/g, '/');

                    return ele;
                });
                this.tableData.push({
                    'time': '合计',
                    'cameraLostFocus': cameraLostFocus,
                    'cameraLost': cameraLost,
                    'cameraError': cameraError,
                });
                this.total = result.result.total;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        handleDownload(row){
            ADS.zipFiles('拍机日志-'+Date.now()+'.zip', [{'name': row.originalName, 'url': api.APIURL+row.simplePath}]);
        },
    },
    computed: {
        ...mapState({
            userName: state => state.nav.userName,
            userId: state => state.nav.userId,
            stationKey: state => state.nav.stationKey,
            role: state => state.nav.role,
            orgId: state => state.nav.orgId,
            orgAdmin: state => state.nav.orgAdmin,
        })
    },
    watch:{
        'accountType': function(nv, ov){
            this.accountTypeO = '';
            this.$nextTick(() => {
                this.accountTypeO = nv;
            });
            this.handlePageChange({'currentPage': 1});
        },
    }
};
</script>
<style scoped lang="scss">
.wrap{
    position: relative;
    width: calc(100% - 200px);
    height: 100%;
    padding-left: 200px;
    text-align: left;
    .box{
        position: relative;
        width: 100%;
        height: 100%;
        background: #EFF1F5;
        .head-box{
            position: relative;
            width: calc(100% - 40px);
            padding: 0 20px;
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .head-right{
                display: flex;
                align-items: center;
            }
        }
        .search-wrap{
            position: relative;
            width: calc(100% - 40px);
            padding: 0 20px;
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .search-left{
                display: flex;
                align-items: center;
            }
            .search-right{
                display: flex;
                align-items: center;
            }
        }
        .vex-table-box{
            width: calc(100% - 40px);
            padding: 0 20px;
            height: calc(100% - 100px);
            margin-top: 20px;
            #adai-chart{
                position: relative;
                width: 100%;
                height: calc(100% - 20px);
            }
        }
    }
}
.width130{
    width: 130px;
}
.width80{
    width: 80px !important;
}
.width150{
    width: 150px !important;
}
.label{
    margin-right: 10px;
}
.marginL10{
    margin-left: 10px;
}
.marginR10{
    margin-right: 10px;
}
</style>

