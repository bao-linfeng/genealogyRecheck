<template>
    <div class="reshoot-wrap">
        <div class="head-box">
            <h3 class="title">影像页快速移动</h3>
        </div>
        <div class="content-box">
            <div class="box">
                <label class="label" for="">当前影像位置：</label>
                <el-input class="width200" v-model="fromPage" disabled></el-input>
            </div>
            <div class="box">
                <label class="label" for="">影像移动到第：</label>
                <el-input class="width200" v-model="toPage"></el-input>
                <label class="label" for="">拍后</label>
            </div>
        </div>
        <div class="foot-box">
            <el-button size="medium" @click="close(false)">取消更改</el-button>
            <el-button type="primary" size="medium" @click="save">确认更改</el-button>
        </div>
        <div class="memo-wrap">
            <h3>备注</h3>
            <p>1.本页面只处理单个页面移动；</p>
            <p>2.如页面错乱、大范围页面丢失等复杂问题，还需要在拍机客户端处理；</p>
        </div>
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import DragModule from '../dragModule/DragModule.vue';
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "imageMoveModule",
    components: {
        DragModule,
    },
    props:{
        gcKey: String,
        volumeKey: String,
        page: Number,
    },
    data: () => {
        return {
            fromPage: 1,
            toPage: 1,
        };
    },
    mounted: function(){
        this.fromPage = this.page;
    },
    methods:{
        
        close(f){
            this.$emit('close', f);
        },
        save(){
            this.imageMove();
        },
        async imageMove(){
            let result = await api.patchAxios('v3/review/image/move', {
                'siteKey': this.stationKey,
                'userKey': this.userId,
                'orgKey': this.orgId,
                'volumeKey': this.volumeKey,
                'gcKey': this.gcKey,
                'from': Number(this.fromPage),
                'to': Number(this.toPage)
            });
            if(result.status == 200){
                this.$emit('save', {'fromPage': Number(this.fromPage), 'toPage': Number(this.toPage)});
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
        'page': function(nv, ov){
            this.fromPage = this.page;
        }
    }
};
</script>

<style scoped lang="scss">
.reshoot-drag{
    width: 400px !important;
    height: 340px !important;
}
.reshoot-wrap{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 50px 20px 50px;
    color: #333;
    text-align: left;
    cursor: pointer;
    background: #fff;
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
            // background: #000;
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
}
.foot-box{
    text-align: center;
}
.memo-wrap{
    margin-top: 10px;
}
.update-box{
    position: relative;
    width: 120px;
    height: 30px;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    .input{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        opacity: 0;
    }
    i{

        color: #358acd;
        font-style: normal;
    }
}
.img-box{
    position: relative;
    width: 200px;
    height: 200px;
    border: 1px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    img{
        max-width: 100%;
        max-height: 100%;
    }
}
.explain-wrap{
    display: flex;
    margin: 20px 0;
    .explain-box{
        margin-left: 20px;
        border: 1px solid #ddd;
        padding: 10px;
    }
}
.width200{
    width: 200px;
}
</style>

