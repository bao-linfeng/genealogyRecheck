<template>  
    <div class="wrap">
        <Sidebar />
        <div class="content">
            <div class="head-wrap">
                <span class="title">菜单定义</span>
                <div class="head-right">
                    <el-button type="primary" size="medium" @click="handleAdd">新增</el-button>
                </div>
            </div>
            <div class="search-wrap">
                <el-input class="width150" v-model="formTitle" placeholder="请输入项目标题" size="medium"></el-input>
                <el-input class="width150" v-model="menuName" placeholder="请输入标题" size="medium"></el-input>
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
                    <vxe-table-column field="_key" title="ID" width="100"></vxe-table-column>
                    <vxe-table-column field="formTitle" title="项目标题" width="100"></vxe-table-column>
                    <vxe-table-column field="menuTitle" title="标题"></vxe-table-column>
                    <vxe-table-column field="route" title="路由"></vxe-table-column>
                    <vxe-table-column field="icon" title="图标"></vxe-table-column>
                    <vxe-table-column field="level" title="Level" width="80"></vxe-table-column>
                    <vxe-table-column type="html" title="拖动" field="move" width="60"></vxe-table-column>
                    <vxe-table-column title="操作" width="150" :cell-render="{name: 'AdaiActionButton', attr: {data: actionData}, events: {'edit': handleEdit, 'delete': handleDelete}}"></vxe-table-column>
                </vxe-table>
            </div>
        </div>
        <Loading v-show="loading" />
        <!-- 编辑 -->
        <EditModule v-if="isShow" :read="read" :detail="detail" v-on:close="handleClose" />
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import Sidebar from "../../components/sidebar/Sidebar.vue";
import { mapState, mapActions, mapGetters } from "vuex";
import EditModule from '../../components/menuDefinition/EditModule.vue';
export default {
    name: "menuDefinition",
    components: {
        Sidebar, EditModule,
    },
    data: () => {
        return {
            loading: false,
            tableData: [],
            menuName: '',
            formTitle: '',
            page: 1,
            limit: 20,
            total: 0,
            h: 0,
            sortField: '',
            sortType: '',
            actionData: [
                {'label': '编辑', 'value': 'edit'},
                {'label': '删除', 'value': 'delete'},
            ],
            isShow: false,
            read: true,
            sortable: '',
        };
    },
    created:function(){
        this.h = window.innerHeight - 50 - 50 - 20;
    },
    mounted:function(){
        this.getDataList();
    },
    beforeDestroy(){
        if(this.sortable) {
            this.sortable.destroy()
        }
    },
    methods:{
        rowDrop(){
            this.$nextTick(() => {
                let xTable = this.$refs.xTable
                this.sortable = Sortable.create(xTable.$el.querySelector('.vxe-table tbody'), {
                    handle: '.drag-btn',
                    onEnd: ({ newIndex, oldIndex }) => {
                        let sortArr = [];
                        let currRow = this.tableData.splice(oldIndex, 1)[0]
                        this.tableData.splice(newIndex, 0, currRow)
                        this.tableData.map((item)=>{sortArr.push(item._key)})
                        console.log(sortArr);
                        if(sortArr.length){
                            this.menuSort(sortArr);
                        }
                        
                    }
                })
            })
        },
        async menuSort(arr){
            let result = await api.patchAxios('menu/sort', {
                menuKeyArray: arr
            });

            if(result.status == 200){
                this.getDataList();
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        sortChangeEvent({column, property, order, sortBy, sortList, $event}){
            console.log(property, order, sortBy);
            this.sortField = sortBy;
            this.sortType = order;
        },
        rowClassName({ row, rowIndex }){
            
        },
        handleEdit({row}){
            this.read = false;
            this.isShow = true;
            this.detail = row;
        },
        handleDelete({row}){
            this.$confirm('此操作将永久删除该菜单数据，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteFn(row);
            }).catch(() => {});
        },
        async deleteFn(row){
            let result = await api.deleteAxios('menu', {
                "menuKey": row._key,
            });
            if(result.status == 200){
                ADS.message('删除成功！', true);
                this.getDataList();
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        async getDataList(){
            this.tableData = [];
            this.loading = true;
            let result = await api.getAxios('menu?menuName='+this.menuName+'&formTitle='+this.formTitle);
            this.loading = false;
            if(result.status == 200){
                this.tableData = result.data.map((ele) => {
                    ele.move = "<img class='drag-btn' title='拖动' src='"+require('../../assets/cnki/drag.svg')+"' />";
                    ele.createTimeO = ele.createTime ? ADS.getLocalTime(ele.createTime, '/', 1) : '';

                    return ele;
                });

                this.rowDrop();
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        handleAdd(){
            this.read = false;
            this.isShow = true;
            this.detail = {};
        },
        handleClose(){
            this.isShow = false;
            this.read = true;
            this.getDataList();
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

