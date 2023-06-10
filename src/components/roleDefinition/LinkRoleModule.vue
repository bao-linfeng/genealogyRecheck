<template>
    <div class="edit-wrap" @keyup.stop="">
        <div class="head-wrap">
            <h3 class="title">{{!parameter._key ? '新增' : '编辑'}}角色</h3>
            <div class="head-right">
                <el-button type="primary" size="medium" @click="save">保存</el-button>
                <img class="close" @click="close(0)" src="../../assets/close.svg" alt="" />
            </div>
        </div>
        <div class="content-wrap">
            <div class="input-box">
                <label class="label" for="">角色类型:</label>
                <vxe-select class="width250" v-model="parameter.roleType" placeholder="请选择角色类型">
                    <vxe-option v-for="(item,index) in roleTypeList" :key="index" :value="item.value" :label="item.label"></vxe-option>
                </vxe-select>
            </div>
            <div class="input-box">
                <label class="label" for="">角色名:</label>
                <el-input class="width250" v-model="parameter.roleName" placeholder="请输入角色名" size="medium" :disabled="read" :clearable="true"></el-input>
            </div>
            <div class="input-box">
                <!-- <label class="label" for="">机构管理员可见:</label> -->
                <el-checkbox v-model="parameter.isOrg">机构可见</el-checkbox>
            </div>
        </div>
        <div v-if="parameter._key" class="head-wrap">
            <h3 class="title">菜单权限分配</h3>
            <div class="head-right">
                <el-button type="primary" size="medium" @click="roleRelaMenu">保存</el-button>
            </div>
        </div>
        <el-transfer 
            v-if="parameter._key"
            v-model="menuData" 
            :data="tableData"
            :titles="['Source', 'Target']"
            >
        </el-transfer>
        <!-- <vxe-table
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
            :data="tableData"
            @checkbox-all="selectAllEvent"
            @checkbox-change="selectChangeEvent"
            >
            <vxe-table-column type="checkbox" width="60"></vxe-table-column>
            <vxe-table-column field="title" title="菜单名" width="150"></vxe-table-column>
            <vxe-table-column title="增" width="60"></vxe-table-column>
            <vxe-table-column title="删" width="60"></vxe-table-column>
            <vxe-table-column title="改" width="60"></vxe-table-column>
            <vxe-table-column title="查" width="60"></vxe-table-column>
        </vxe-table> -->
    </div>
</template>

<script>
import ADS from "../../ADS.js";
import api from "../../api.js";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "editModule",
    props:{
        detail: {
            type: Object
        },
        read: Boolean,
    },
    data: () => {
        return {
            parameter: {'_key': '', 'roleName': '', 'roleType': '', 'isOrg': ''},
            h: 300,
            selectRecords: [],
            tableData: [],
            loading: false,
            menuData: [],
            roleTypeList: [
                {'label': 'host', 'value': 'host'},
                {'label': 'agent', 'value': 'agent'},
            ],
        };
    },
    mounted: function(){
        this.parameter = {
            '_key': this.detail.roleKey, 
            'roleType': this.detail.roleType,
            'roleName': this.detail.roleName, 
            'isOrg': this.detail.isOrg == 1 ? true : false
        };

        if(this.parameter._key){
            this.getMenuList()
            this.getRoleRightList();
        }
    },
    methods:{
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
        close(f){
            this.$emit('close', f);
        },
        save(){
            if(this.parameter._key){
                this.editFn();
            }else{
                this.addFn();
            }
        },
        async addFn(){
            if(!this.parameter.roleType){
                return ADS.message('角色类型必填');
            }
            if(!this.parameter.roleName){
                return ADS.message('角色名必填');
            }
            let result = await api.postAxios('roleName', {
                'roleType': this.parameter.roleType,
                "roleName": this.parameter.roleName,
                'isOrg': this.parameter.isOrg ? '1' : ''
            });
            if(result.status == 200){
                ADS.message('新增角色成功！', true);
                this.close(1);
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        async editFn(){
            if(!this.parameter.roleType){
                return ADS.message('角色类型必填');
            }
            if(!this.parameter.roleName){
                return ADS.message('角色名必填');
            }
            let result = await api.patchAxios('roleName', {
                "roleKey": this.parameter._key,
                "patchData": {
                    'roleType': this.parameter.roleType,
                    'roleName': this.parameter.roleName,
                    'isOrg': this.parameter.isOrg ? '1' : ''
                }
            });
            if(result.status == 200){
                ADS.message('编辑角色成功！', true);
                this.close(2);
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        async roleRelaMenu(){
            if(!this.menuData.length){
                return ADS.message('请选择菜单！');
            }
            let menuDataArr = [];
            this.menuData.forEach((ele) => {
                menuDataArr.push({'menuKey': ele, "right": ["read", "add", 'delete', 'edit']});
            });

            let result = await api.postAxios('roleRelaMenu', {
                "roleKey": this.parameter._key,
                "menuArray": menuDataArr
            });
            if(result.status == 200){
                ADS.message('角色关联菜单成功！', true);
                this.close(1);
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        async getMenuList(){
            this.loading = true;
            let result = await api.getAxios('menu');
            this.loading = false;
            if(result.status == 200){
                this.tableData = result.data.map((ele) => {
                    ele.key = ele._key;
                    ele.label = ele.menuTitle;

                    return ele;
                });
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        async getRoleRightList(){
            let result = await api.getAxios('roleRight?roleKey='+this.parameter._key);
            if(result.status == 200){
                let menuData = [];
                result.data.forEach((ele) => {
                    menuData.push(ele.menuKey);
                });
                this.menuData = menuData;
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
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
        'selectRecords': function(nv, ov){
            console.log(nv);
        },
        'menuData': function(nv, ov){
            // console.log(nv);
        },
    }
};
</script>

<style scoped lang="scss">
.edit-wrap{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border: 1px solid #ddd;
    font-size: 14px;
    color: #000;
    padding: 20px;
    border-radius: 5px;
    z-index: 10;
    .head-wrap{
        position: relative;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .head-right{
            display: flex;
            align-items: center;
            .close{
                margin-left: 10px;
                cursor: pointer;
            }
        }
    }
    .content-wrap{
        position: relative;
        margin: 10px 0;
        .input-box{
            display: flex;
            align-items: center;
            text-align: left;
            margin-bottom: 10px;
            .label{
                display: block;
                width: 100px;
                height: 40px;
                line-height: 40px;
            }
        }
    }
    .foot-wrap{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
    }
}
.width250{
    width: 250px;
}
</style>

