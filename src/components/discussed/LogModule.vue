<template>
    <Drag>
        <section class="catalog-box">
            <header class="head-box">
                <h3 class="title">记录列表</h3>
                <img class="close" @click="close(false)" src="../../assets/close.svg" alt="">
            </header>
            <main class="content-box" @mousedown.stop="">
                <vxe-table
                    border
                    resizable
                    stripe
                    keep-source
                    show-overflow
                    highlight-hover-row
                    row-key
                    ref="xTable"
                    :height="h"
                    :align="'center'"
                    :data="tableData">
                    <vxe-table-column field="log" title="日志内容"></vxe-table-column>
                    <vxe-table-column field="userName" title="操作者"></vxe-table-column>
                    <vxe-table-column field="timeO" title="操作时间"></vxe-table-column>
                </vxe-table>
            </main>
            <footer class="foot-box" @mousedown.stop="">
                <vxe-pager
                    align="right"
                    @page-change = "changePage"
                    :current-page.sync="page"
                    :page-size.sync="limit"
                    :total="total"
                    :layouts="['PrevJump', 'PrevPage', 'JumpNumber','NextPage', 'NextJump', 'FullJump', 'Total']">
                </vxe-pager>
            </footer>
        </section>
    </Drag>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import Drag from '../Drag.vue';
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "logModule",
    props:{
        gid:{
            type: String
        },
    },
    components: {
        Drag, 
    },
    data: () => {
        return {
            tableData: [],
            h:300,
            page: 1,
            pages: 0,
            limit: 30,
            total: 0,
        };
    },
    mounted:function(){
        this.h = window.innerHeight - 100 - 60 - 70;
        this.getDataList();
    },
    methods:{
        close(flag){
            this.$emit('close', flag);
        },
        async getDataList(){
            // isGCOrVolume 不传所有，1 只谱的，2 只卷册的
            let result = await api.getAxios('review/GCOperationLogList?siteKey='+this.stationKey+'&catalogKey='+this.gid+'&isGCOrVolume=1&logType=&startTime=&endTime=&page='+this.page+'&limit='+this.limit);
            if(result.status == 200){
                this.tableData = result.data.list.map((ele)=>{
                    ele.timeO = ADS.getLocalTime(ele.time);
                    return ele;
                });
                this.pages = result.data.pageNum;
                this.total = result.data.total;
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
        })
    },
};
</script>

<style scoped lang="scss">
.catalog-box{
    position: relative;
    width: 1000px;
    height: calc(100% - 100px);
    padding: 0 20px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 1px 2px #ddd;
}
.head-box{
    position: relative;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    .close{
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        cursor: pointer;
    }
}
.content-box{
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    height: calc(100% - 120px);
}
.foot-box{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
}
</style>

