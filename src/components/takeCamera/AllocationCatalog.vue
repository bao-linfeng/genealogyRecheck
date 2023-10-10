<template>
    <div class="allocationCatalog-wrap">
        <div class="allocationCatalog-box">
            <div class="head-box">
                <h3 class="title">打回谱目分配</h3>
            </div>
            <div class="content-box">
                <div class="search-wrap">
                    <el-input class="width150" size="medium" v-model="gcKey" placeholder="请输入谱ID" clearable></el-input>
                    <el-input class="width200" size="medium" v-model="genealogyName" placeholder="请输入谱名" clearable></el-input>
                    <el-button type="primary" size="medium" @click="handleSearch">检索</el-button>
                </div>
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
                    @checkbox-change = "checkboxChange"
                    @checkbox-all = "checkboxChange"
                    :data="tableData">
                    <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                    <vxe-table-column field="gcKey" title="谱ID" width="120"></vxe-table-column>
                    <vxe-table-column field="genealogyName" title="谱名"></vxe-table-column>
                </vxe-table>
                <el-select class="marginT10" v-model="targetUKey" placeholder="供应商(影像审核员)">
                    <el-option
                        v-for="item in userList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="foot-box">
                <el-button size="medium" @click="close(false)">取消</el-button>
                <el-button type="primary" size="medium" @click="save">确定分配</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "allocationCatalog",
    props:{
        
    },
    components: {

    },
    data: () => {
        return {
            tableData: [],
            h:300,
            targetUKey: '',
            userList: [],
            gcKeyArray: [],
            gcKey: '',
            genealogyName: '',
        };
    },
    mounted:function(){
        this.h = window.innerHeight - 120 - 100 - 60 - 40;
        this.getOrgMember();
        this.returnVolumeGCList();
    },
    methods:{
        handleSearch(){
            this.returnVolumeGCList();
        },
        close(flag){
            this.$emit('close', flag);
        },
        async batchAssignReturnVolumeGC(){
            let result = await api.postAxios('v3/camera/batchAssignReturnVolumeGC', {
                'siteKey': this.stationKey,
                'userKey': this.userId,
                'gcKeyArray': this.gcKeyArray,
                'targetUKey': this.targetUKey,
            });
            if(result.status == 200){
                this.close(true);
                ADS.message('打回谱目已分配成功!', true);
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' });
            }
        },
        async returnVolumeGCList(){
            let result = await api.getAxios('v3/camera/returnVolumeGCList?siteKey='+this.stationKey+'&userKey='+this.userId+'&gcKey='+this.gcKey+'&genealogyName='+this.genealogyName);
            if(result.status == 200){
                this.tableData = result.data;
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' });
            }
        },
        async getOrgMember(){
            let result = await api.getAxios('org/member?orgKey='+this.orgId);
            if(result.status == 200){
                this.userList = result.data.filter((ele)=>{
                    ele.label = ele.userName;
                    ele.value = ele._key;
                    return ele.roleKey == '9138241994';
                });
                this.userList = arr;
                console.log(this.userList);
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' });
            }
        },
        save(){
            if(!this.gcKeyArray.length){
                return ADS.message('请选择需要分配的谱目!');
            }
            if(!this.targetUKey){
                return ADS.message('请选择分配人!');
            }
            this.batchAssignReturnVolumeGC();
        },
        checkboxChange({records}){
            console.log(records);
            let arr = [];
            records.forEach((ele)=>{
                arr.push(ele.gcKey);
            });
            this.gcKeyArray = arr;
        },
    },
    computed: {
        ...mapState({
            stationKey: state => state.nav.stationKey,
            stationName: state => state.nav.stationName,
            stationlogo: state => state.nav.stationlogo,
            userId: state => state.nav.userId,
            orgId: state => state.nav.orgId,
        })
    },
};
</script>

<style scoped lang="scss">
.allocationCatalog-wrap{
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
    .allocationCatalog-box{
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
        }
        .content-box{
            position: relative;
            height: calc(100% - 120px);
            .search-wrap{
                display: flex;
                align-items: center;
                height: 40px;
            }
        }
        .foot-box{
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 60px;
        }
    }
}
.width200{
    width: 200px;
}
.width150{
    width: 150px;
}
.marginT10{
    margin-top: 10px;
}
</style>

