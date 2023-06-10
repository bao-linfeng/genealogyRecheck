<template>
    <div class="edit-wrap" @keyup.stop="">
        <div class="head-wrap">
            <h3 class="title">关联用户</h3>
            <div class="head-right">
                <img class="close" @click="close(0)" src="../../assets/close.svg" alt="" />
            </div>
        </div>
        <div class="content-wrap">
            <div class="input-box">
                <label class="label" for="">添加关联用户</label>
                <el-input class="width100" v-model="keyword" placeholder="请输入用户名" size="medium" @change="getWaitUserList" :clearable="true"></el-input>
            </div>
        </div>
        <el-table
            :data="userList"
            border
            max-height="300"
            style="width: 100%">
            <el-table-column prop="userName" label="姓名" width="120"></el-table-column>
            <el-table-column prop="mobile" label="号码"></el-table-column>
            <el-table-column prop="roleName" label="当前角色" width="120"></el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="60">
                <template slot-scope="scope">
                    <el-button v-if="!scope.row.roleName" @click="userRelaRole(scope.row)" type="text" size="small">添加</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="content-wrap">
            <div class="input-box">
                <label class="label" for="">已关联用户</label>
            </div>
        </div>
        <el-table
            :data="tableData"
            border
            max-height="300"
            style="width: 100%">
            <el-table-column prop="userName" label="姓名" width="120"></el-table-column>
            <el-table-column prop="mobile" label="号码"></el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="60">
                <template slot-scope="scope">
                    <el-button @click="deleteUserRelaRole(scope.row)" type="text" size="small">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
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
    },
    data: () => {
        return {
            keyword: '',
            h: 300,
            tableData: [],
            loading: false,
            userList: [],
        };
    },
    mounted: function(){
        this.getRoleUserList();
    },
    methods:{
        async userRelaRole(row){
            let result = await api.postAxios('userRelaRole', {
                "roleKey": this.detail.roleKey,
                "userKey": row.userKey
            });
            if(result.status == 200){
                this.getWaitUserList();
                this.getRoleUserList();
                this.close(2);
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        async deleteUserRelaRole(row){
            let result = await api.deleteAxios('userRelaRole', {
                "userKey": row.userKey
            });
            if(result.status == 200){
                this.getWaitUserList();
                this.getRoleUserList();
                this.close(2);
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        close(f){
            this.$emit('close', f);
        },
        async getWaitUserList(){
            let result = await api.getAxios('waitUserList?keyword='+this.keyword);
            if(result.status == 200){
                this.userList = result.data.map((ele) => {
                    return ele;
                });
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        async getRoleUserList(){
            let result = await api.getAxios('roleUserList?roleKey='+this.detail.roleKey);
            if(result.status == 200){
                this.tableData = result.data.map((ele) => {
                    return ele;
                });
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
    width: 450px;
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
</style>

