<template>
    <DragModule class="w1200">
        <div class="log-box">
            <div class="head-box">
                <h3 class="title">命中规则谱目列表</h3>
                <img class="close" @click="close(false)" src="../../assets/close.svg" alt="">
            </div>
            <div class="content-box" @mousedown.stop="">
                <el-table
                    :data="tableData"
                    :height="h"
                    border
                    style="width: 100%">
                    <el-table-column prop="rules" label="命中规则" width="150" align="center"></el-table-column>
                    <el-table-column prop="repeatOSBN" label="谱ID" width="100" align="center"></el-table-column>
                    <el-table-column prop="genealogyName" label="谱名" align="center"></el-table-column>
                    <el-table-column prop="surname" label="姓氏" width="100" align="center"></el-table-column>
                    <el-table-column prop="publish" label="出版年" width="100" align="center"></el-table-column>
                    <el-table-column prop="hall" label="堂号" width="100" align="center"></el-table-column>
                    <el-table-column prop="authors" label="作者" width="100" align="center"></el-table-column>
                    <el-table-column prop="place" label="谱籍地(现代)" width="150" align="center"></el-table-column>
                    <el-table-column prop="volume" label="卷册说明" align="center"></el-table-column>
                    <el-table-column prop="lostVolume" label="缺卷说明" align="center"></el-table-column>
                    <el-table-column prop="condition" label="状态" width="100" align="center"></el-table-column>
                    <el-table-column prop="orgName" label="上传机构" width="100" align="center"></el-table-column>
                    <el-table-column prop="Filenames" label="档名" width="100" align="center"></el-table-column>
                    <el-table-column prop="bookId" label="谱书编号" width="100" align="center"></el-table-column>
                    <el-table-column prop="DGS" label="DGS号码" width="100" align="center"></el-table-column>
                    <el-table-column prop="genealogyGroupID" label="家谱群组ID" width="100" align="center"></el-table-column>
                    <el-table-column prop="indexAssign" label="索引分配" width="120" align="center"></el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="120"
                        align="center">
                        <template slot-scope="scope">
                            <el-button @click="lookBook(scope.row)" type="text" size="small">详情</el-button>
                            <el-button v-if="scope.row.imageLink || scope.row.volumeNumber" @click="lookImage(scope.row)" type="text" size="small">影像</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <vxe-pager
                    align="right"
                    @page-change = "changePage"
                    :current-page.sync="page"
                    :page-size.sync="limit"
                    :total="total"
                    :layouts="['PrevJump', 'PrevPage', 'JumpNumber','NextPage', 'NextJump', 'FullJump', 'Total']">
                </vxe-pager>
            </div>
        </div>
        <!-- 查看谱目 -->
        <CatalogView v-if="isShow == 2" :read="isRead" :dataKey="dataKey" :vid="''" v-on:close="isShow = 0" />
    </DragModule>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import { mapState, mapActions, mapGetters } from "vuex";
import DragModule from '../../components/dragModule/DragModule.vue';
import CatalogView from '../../components/takeCamera/CatalogView.vue';
export default {
    name: "recheckList",
    props:{
        id:{
            type: String
        },
    },
    components: {
        DragModule, CatalogView,
    },
    data: () => {
        return {
            tableData: [],
            h: 300,
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
    created:function(){
        // this.h = window.innerHeight - 100 - 60 - 50;
    },
    mounted:function(){
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
            let result = await api.getAxios('data/editGCCheckLog?checkTaskKey='+this.id+'&page='+this.page+'&limit='+this.limit);
            if(result.status == 200){
                this.tableData = result.result.list.map((ele)=>{
                    ele.timeO = ADS.getLocalTime(ele.time);
                    if(ele.rule && ele.rule.length){
                        let rule = ele.rule,rules='';
                        rule.map((item2)=>{
                            rules = rules + item2.rule+'('+item2.repeatPercent+'%);';
                        });
                        ele.rules = rules;
                    }
                    return ele;
                });
                this.pages = 1;
                this.total = result.result.list.length;
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
.w1200{
    height: 410px !important;
}
.log-box{
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
    height: calc(100% - 60px);
    // display: flex;
    // flex-wrap: wrap;
    // justify-content: space-between;
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
</style>

