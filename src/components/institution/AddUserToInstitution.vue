<template>
    <div class="edit-wrap" @keyup.stop="">
        <div class="head-wrap">
            <h3 class="title">编辑</h3>
            <div class="head-right">
                <img class="close" @click="close(0)" src="../../assets/close.svg" alt="" />
            </div>
        </div>
        <div class="content-wrap">
            <div class="input-box">
                <label class="label" for="">添加机构成员</label>
                <el-input class="width100" v-model="keyword" placeholder="请输入用户名" size="medium" @change="getUserListByInstitutionKey()" :clearable="true"></el-input>
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
                    <el-button v-if="!scope.row.hasAdd" @click="addMember(scope.row)" type="text" size="small">添加</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="content-wrap">
            <div class="input-box">
                <label class="label" for="">机构成员列表({{tableData.length}})</label>
            </div>
        </div>
        <el-table
            :data="tableData"
            border
            max-height="300"
            style="width: 100%">
            <el-table-column prop="userName" label="姓名" width="120"></el-table-column>
            <el-table-column prop="mobile" label="号码" width="120"></el-table-column>
            <el-table-column prop="roleName" label="角色" width="180">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.roleKey" @change="handleChangeRole(scope.row)" placeholder="请选择角色" size="small">
                        <el-option
                            v-for="item in roleList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="role" label="管理员"></el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button @click="deleteMember(scope.row)" type="text" size="small">移除</el-button>
                    <el-button v-if="scope.row.role != 'admin'" @click="setOrgAdmin(scope.row)" type="text" size="small">管理员</el-button>
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
    name: "addUserToInstitution",
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
            roleList: [],
        };
    },
    mounted: function(){
        this.getMember();
        this.getRoleList();
    },
    methods:{
        async getRoleList(){
            let result = await api.getAxios('role?roleName=');
            if(result.status == 200){
                let roleList = [];
                result.data.forEach((ele) => {
                    if(this.orgAdmin == 'admin'){
                        if(ele.isOrg == 1){
                            roleList.push({'label': ele.roleName, 'value': ele.roleKey});
                        }
                    }else{
                        roleList.push({'label': ele.roleName, 'value': ele.roleKey});
                    }
                });
                this.roleList = roleList;
                // this.roleList.unshift({'label': '移除角色', 'value': ''});
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        async getUserListByInstitutionKey(){
            let result = await api.getAxios('org/user/search?keyWord='+this.keyword+'&orgKey='+this.detail._key+'&siteKey='+this.stationKey);
            if(result.status == 200){
                this.userList = result.data;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        async getMember(){
            this.tableData = [];
            let result = await api.getAxios('org/member?orgKey='+this.detail._key);
            if(result.status == 200){
                this.tableData = result.data;
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' })
            }
        },
        async addMember(row){
            let result = await api.postAxios('org/member',{orgKey: this.detail._key, userKey: row._key});
            if(result.status == 200){
                this.getUserListByInstitutionKey();
                this.getMember();
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' })
            }
        },
        async deleteMember(row){
            let result = await api.deleteAxios('org/member',{orgKey: this.detail._key, userKey: row._key});
            if(result.status == 200){
                // this.getUserListByInstitutionKey();
                this.getMember();
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' })
            }
        },
        async setOrgAdmin(row){
            let result = await api.patchAxios('org/admin',{orgKey: this.detail._key, userKey: row._key});
            if(result.status == 200){
                this.getMember();
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' })
            }
        },
        async userRelaRole(row){
            let result = await api.postAxios('userRelaRole', {
                "roleKey": row.roleKey,
                "userKey": row._key
            });
            if(result.status == 200){

            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        async deleteUserRelaRole(row){
            let result = await api.deleteAxios('userRelaRole', {
                "userKey": row._key
            });
            if(result.status == 200){

            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        handleChangeRole(data){
            if(data.roleKey){
                this.userRelaRole(data);
            }else{
                this.deleteUserRelaRole(data);
            }
        },
        close(f){
            this.$emit('close', f);
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
    width: 600px;
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
</style>

