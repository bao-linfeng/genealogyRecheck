<template>
    <div class="wran-wrap">
        <div class="wran-box">
            <div class="head-box">
                <h3 class="title">完结报错列表</h3>
                <img class="close" @click="close(false)" src="../../assets/close.svg" alt="">
            </div>
            <div class="content-box">
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
                    <vxe-table-column field="gcKey" title="谱ID" width="100"></vxe-table-column>
                    <vxe-table-column field="genealogyName" title="谱名"></vxe-table-column>
                    <vxe-table-column field="hasVolume" title="可拍册数" width="100"></vxe-table-column>
                    <vxe-table-column field="passVolumeNumber" title="通过册数" width="100"></vxe-table-column>
                    <vxe-table-column field="errorReason" title="失败原因"></vxe-table-column>
                </vxe-table>
                <!-- <vxe-pager
                    align="right"
                    @page-change = "changePage"
                    :current-page.sync="page"
                    :page-size.sync="limit"
                    :total="total"
                    :layouts="['PrevJump', 'PrevPage', 'JumpNumber','NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']">
                </vxe-pager> -->
            </div>
            <div class="foot-box">
                
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "catalogPassWarn",
    props:{
        list:{
            type: Array
        },
    },
    components: {

    },
    data: () => {
        return {
            tableData: [],
            h:300,
            page: 1,
            pages: 0,
            limit: 20,
            total: 0,
        };
    },
    mounted:function(){
        this.h = window.innerHeight - 100 - 60 - 50;

        this.tableData = this.list;
    },
    methods:{
        close(flag){
            this.$emit('close', flag);
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
.wran-wrap{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    .wran-box{
        position: relative;
        width: 1000px;
        height: calc(100% - 100px);
        padding: 0 20px;
        background: #fff;
        border-radius: 5px;
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
    }
    .content-box{
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .foot-box{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
    }
}
</style>

