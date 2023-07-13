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
                max-height="350">
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
            this.$confirm('此操作将删除的影像恢复, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.restoreLogicDeleteImage(row._key);
            }).catch(() => {});
        },
        async restoreLogicDeleteImage(imageKey){// 恢复误删的影像页
            let result = await api.patchAxios('v3/review/image/restoreLogicDeleteImage', {
                'siteKey': this.stationKey,
                'userKey': this.userId,
                'orgKey': this.orgId,
                'volumeKey': this.volumeKey,
                'imageKey': imageKey
            });
            if(result.status == 200){
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
</style>

