<template>
    <DragModule class="w800">
        <div class="invoice-box">
            <div class="head-box">
                <h3 class="title">已开发票卷册列表</h3>
                <img class="close" @click="close(false)" src="../../assets/close.svg" alt="">
            </div>
            <div class="content-box" @mousedown.stop="">
                <el-table
                    :data="tableData"
                    :height="h"
                    border
                    style="width: 100%">
                    <el-table-column prop="volumeKey" label="卷ID" align="center"></el-table-column>
                    <el-table-column prop="volumeNumber" label="卷名" align="center"></el-table-column>
                    <el-table-column prop="billKey" label="发票ID" align="center"></el-table-column>
                    <el-table-column prop="billNo" label="发票编号" align="center"></el-table-column>
                    <!-- <el-table-column
                        fixed="right"
                        label="操作"
                        width="120"
                        align="center">
                        <template slot-scope="scope">
                            <el-button @click="lookBook(scope.row)" type="text" size="small">详情</el-button>
                            <el-button v-if="scope.row.imageLink || scope.row.volumeNumber" @click="lookImage(scope.row)" type="text" size="small">影像</el-button>
                        </template>
                    </el-table-column> -->
                </el-table>
            </div>
        </div>
    </DragModule>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import { mapState, mapActions, mapGetters } from "vuex";
import DragModule from '../../components/dragModule/DragModule.vue';
export default {
    name: "invoiceList",
    props:{
        id:{
            type: String
        },
    },
    components: {
        DragModule, 
    },
    data: () => {
        return {
            tableData: [],
            h:300,
            page: 1,
            pages: 0,
            limit: 20,
            total: 0,
            actionData: [
                {'label': '详情', 'value': 'lookBook'}
            ],
            isShow: 1,
            isRead: true,
            dataKey: '',
        };
    },
    mounted:function(){
        this.h = window.innerHeight - 100 - 60 - 50;
        this.getDataList();
    },
    methods:{
        lookBook( row ){
            console.log(row);
            this.dataKey = row.repeatOSBN;
            this.isShow = 2;
        },
        lookImage(row){
            if(row.imageLink){
                window.open(row.imageLink);
            }else{
                window.open('/'+this.pathname+'/viewImage?gid='+row.gcKey+'&genealogyName='+row.genealogyName);
            }
        },
        close(flag){
            this.$emit('close', flag);
        },
        async getDataList(){
            let result = await api.getAxios('data/gcVolumeBillInfo?gcKey='+this.id);
            if(result.status == 200){
                this.tableData = result.result.map((ele)=>{
                    
                    return ele;
                });
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' });
            }
        },
        changePage({currentPage}){// 页码切换回调
            this.page = currentPage;
            this.getDataList();
        },
    },
    computed: {
        ...mapState({
            stationKey: state => state.nav.stationKey,
            stationName: state => state.nav.stationName,
            stationlogo: state => state.nav.stationlogo,
            userId: state => state.nav.userId,
            pathname: state => state.nav.pathname,
        })
    },
};
</script>

<style scoped lang="scss">
.invoice-box{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0 20px;
    background: #fff;
    z-index: 100;
    .head-box{
        position: relative;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .close{
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            cursor: pointer;
        }
    }
}
.content-box{
    position: relative;
    .input-box{
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .label{
            width: 100px;
        }
    }
}
.foot-box{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
}
.width200{
    width: 200px;
}
.marginL10{
    margin-right: 10px;
}
.w800{
    width: 800px;
}
</style>

