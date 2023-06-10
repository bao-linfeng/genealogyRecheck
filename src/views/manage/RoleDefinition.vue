<template>  
    <div class="wrap">
        <Sidebar />
        <div class="content">
            <div class="head-wrap">
                <span class="title">角色定义</span>
                <div class="head-right">
                    <el-button type="primary" size="medium" @click="handleAdd">新增</el-button>
                </div>
            </div>
            <div class="search-wrap">
                <vxe-select class="width150" v-model="roleType">
                    <vxe-option v-for="(item,index) in roleTypeList" :key="index" :value="item.value" :label="item.label"></vxe-option>
                </vxe-select>
                <el-input class="width150" v-model="roleName" placeholder="请输入角色名" size="medium"></el-input>
                <el-checkbox v-model="isOrg">机构可见</el-checkbox>
                <el-button type="primary" size="medium" @click="getDataList">检索</el-button>
            </div>
            <div class="vex-table-box">
                <vxe-table
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
                    :row-class-name="rowClassName"
                    :sort-config="{trigger: 'cell', orders: ['desc', 'asc', 'auto'], remote: true}"
                    @sort-change="sortChangeEvent"
                    >
                    <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                    <vxe-table-column field="roleKey" title="ID" width="100"></vxe-table-column>
                    <vxe-table-column field="roleType" title="角色类型" width="100"></vxe-table-column>
                    <vxe-table-column field="roleName" title="角色名"></vxe-table-column>
                    <vxe-table-column field="menuNumber" title="关联菜单"></vxe-table-column>
                    <vxe-table-column field="userNumber" title="关联用户"></vxe-table-column>
                    <vxe-table-column field="createTimeO" title="创建时间"></vxe-table-column>
                    <vxe-table-column field="isOrgO" title="机构可见" width="80"></vxe-table-column>
                    <vxe-table-column title="操作" width="250" :cell-render="{name: 'AdaiActionButton', attr: {data: actionData}, events: {'linkRole': handleLinkRole, 'linkUser': handleLinkUser, 'delete': handleDelete}}"></vxe-table-column>
                </vxe-table>
            </div>
        </div>
        <Loading v-show="loading" />
        <!-- 关联菜单 -->
        <LinkRoleModule v-if="isShow == 1" :read="read" :detail="detail" v-on:close="handleClose" />
        <!-- 关联菜单 -->
        <LinkUserModule v-if="isShow == 2" :detail="detail" v-on:close="handleClose" />
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import Sidebar from "../../components/sidebar/Sidebar.vue";
import { mapState, mapActions, mapGetters } from "vuex";
import LinkRoleModule from '../../components/roleDefinition/LinkRoleModule.vue';
import LinkUserModule from '../../components/roleDefinition/LinkUserModule.vue';
export default {
    name: "roleDefinition",
    components: {
        Sidebar, LinkRoleModule, LinkUserModule, 
    },
    data: () => {
        return {
            loading: false,
            tableData: [],
            roleName: '',
            roleType: '',
            isOrg: false,
            page: 1,
            limit: 20,
            total: 0,
            h: 0,
            sortField: '',
            sortType: '',
            actionData: [
                {'label': '角色权限', 'value': 'linkRole'},
                {'label': '关联用户', 'value': 'linkUser'},
                {'label': '删除', 'value': 'delete'},
            ],
            roleTypeList: [
                {'label': '全部角色类型', 'value': ''},
                {'label': 'host', 'value': 'host'},
                {'label': 'agent', 'value': 'agent'},
            ],
            isShow: 0,
            read: true,
        };
    },
    created:function(){
        this.h = window.innerHeight - 50 - 50 - 20;
    },
    mounted:function(){
        this.getDataList();
    },
    beforeDestroy(){
        
    },
    methods:{
        sortChangeEvent({column, property, order, sortBy, sortList, $event}){
            console.log(property, order, sortBy);
            this.sortField = sortBy;
            this.sortType = order;
        },
        rowClassName({ row, rowIndex }){
            
        },
        handleLinkRole({row}){
            this.read = false;
            this.isShow = 1;
            this.detail = row;
        },
        handleLinkUser({row}){
            this.isShow = 2;
            this.detail = row;
        },
        handleDelete({row}){
            this.$confirm('此操作将永久删除该角色数据，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteFn(row);
            }).catch(() => {});
        },
        async deleteFn(row){
            let result = await api.deleteAxios('role', {
                "roleKey": row.roleKey
            });
            if(result.status == 200){
                ADS.message('删除菜单成功！', true);
                this.getDataList();
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        async getDataList(){
            let result = await api.getAxios('role?roleName='+this.roleName+'&roleType='+this.roleType+'&isOrg='+(this.isOrg ? '1' : ''));
            if(result.status == 200){
                this.tableData = result.data.map((ele) => {
                    ele.createTimeO = ele.createTime ? ADS.getLocalTime(ele.createTime, '/', 1) : '';
                    ele.isOrgO = ele.isOrg == '1' ? '是' : '';

                    return ele;
                });
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        handleAdd(){
            this.read = false;
            this.isShow = 1;
            this.detail = {};
        },
        handleClose(f){
            console.log(f);
            if(f <= 1){
                this.isShow = 0;
                this.read = true;
            }
            if(f == 1){
                this.getDataList()
            }

            if(f == 2){
                this.getDataList()
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
            orgAdmin: state => state.nav.orgAdmin,
            pathname: state => state.nav.pathname,
            orgId: state => state.nav.orgId,
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
        height: 100%;
        background: #EFF1F5;
        .head-wrap{
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
            height: 50px;
            padding: 0 20px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .vex-table-box{
            position: relative;
            width: calc(100% - 40px);
            padding: 0 20px;
            height: calc(100% - 120px);
        }
    }
}
.width100{
    width: 120px;
}
.width150{
    width: 150px;
}
.marginR10{
    margin-right: 10px;
}
.marginL10{
    margin-left: 10px;
}
</style>

