<template>
    <div class="restore-wrap">
        <div class="head-box">
            <h3 class="title">删除影像列表</h3>
            <img class="close" src="../../assets/close.svg" @click="close" alt="">
        </div>
        <div class="content-box">
            <el-table
                border
                :data="tableData"
                style="width: 100%"
                min-height="350">
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column
                    label="影像">
                    <template slot-scope="scope">
                        <img class="image" :src="imageHref+scope.row.name" alt="">
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="80">
                    <template slot-scope="scope">
                        <el-button @click="handleRestore(scope.row)" type="text" size="small">恢复</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="foot-box">
            
        </div>

        <div class="restore-box" v-if="isShow">
            <div class="head-wrap">
                <h3 class="title">恢复影像</h3>
            </div>
            <div class="main-wrap">
                <label class="label">插入的拍数</label>
                <el-input class="width100" v-model="page"></el-input>
            </div>
            <div class="foot-wrap">
                <el-button type="primary" size="medium" @click="isShow = false">取消</el-button>
                <el-button type="primary" size="medium" @click="handleRestoreSave">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "deleteImageRestoreModule",
    components: {

    },
    props:{
        gcKey: String,
        volumeKey: String,
        imageHref: String,
    },
    data: () => {
        return {
            tableData: [],
            page: 1,
            isShow: false,
            row: {},
        };
    },
    mounted: function(){
        this.getLogicDeleteImageList();
    },
    methods:{
        async getLogicDeleteImageList(){// 该卷册被逻辑删除的影像页列表
            const result = await api.getAxios('v3/review/logicDeleteImageList?volumeKey='+this.volumeKey);
            if(result.status == 200){
                this.tableData = result.data;
            }else{
                ADS.message(result.msg);
            }
        },
        close(f){
            this.$emit('close', f);
        },
        handleRestore(row){
            this.row = row;
            this.isShow = true;
        },
        handleRestoreSave(){
            this.$confirm('此操作将删除的影像恢复, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.restoreLogicDeleteImage(this.row._key);
            }).catch(() => {});
        },
        async restoreLogicDeleteImage(imageKey){// 恢复误删的影像页
            let result = await api.patchAxios('v3/review/image/restoreLogicDeleteImage', {
                'siteKey': this.stationKey,
                'userKey': this.userId,
                'orgKey': this.orgId,
                'volumeKey': this.volumeKey,
                'imageKey': imageKey,
                'page': Number(this.page),
            });
            if(result.status == 200){
                this.row = {};
                this.isShow = false;
                this.getLogicDeleteImageList();
                this.$emit('restore', true);
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
            orgId: state => state.nav.orgId,
        })
    },
    watch:{
        
    }
};
</script>

<style scoped lang="scss">
.restore-wrap{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 50px 20px 50px;
    color: #333;
    text-align: left;
    cursor: pointer;
    background: #fff;
    width: 500px;
    .head-box{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        .close{
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            cursor: pointer;
        }
    }
    .content-box{
        .box{
            margin-bottom: 20px;
            .label{
                margin-right: 10px;
                &.block{
                    display: block;
                    margin-bottom: 20px;
                }
            }
            .image-name{
                font-style: normal;
            }
        }
    }
    .foot-box{
        text-align: center;
    }
}

.image{
    height: 120px;
}
.restore-box{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    text-align: center;
    padding: 10px 20px;
    box-shadow: 0 0 1px 3px #ddd;
    z-index: 1000;
    .head-wrap{
        height: 30px;
        line-height: 30px;
    }
    .main-wrap{
        margin: 10px 0;
        display: flex;
        align-items: center;
        .label{
            width: 100px;
        }
    }
    .foot-wrap{
        
    }
}
.width100{
    width: 200px;
}
</style>

