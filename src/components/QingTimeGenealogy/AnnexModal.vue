<template>
    <div class="annex-modal-wrap">
        <div class="annex-modal-box">
            <div class="annex-modal-title">
                <h3>附件({{gid}})</h3>
                <i class="el-icon-close" @click="close"></i>
            </div>
            <div class="memo-box" v-if="orgAdmin == 'admin' && active == 3">
                <div class="memo-left">
                    <h3 class="title marginR20">补充说明</h3>
                </div>
                <textarea class="memo" v-model="gcStatusRemark"></textarea>
            </div>
            <div class="content-head">
                <h3 class="title">补充影像({{sourceList.length}})</h3>
                <div class="head-left" v-if="active == 3" >
                    <div class="upload-input">
                        <input type="file" accept="image/*" multiple @change="uploadImg" />
                    </div>
                </div>
            </div>
            <div class="image_wrap style1">
                <div class="image_box" v-for="(item,index) in sourceList" :key="'sourceList'+index">
                    <img @click="previewImages(index)" :src="item.gcFile && item.gcFile.indexOf('https://cdn-icare.qingtime.cn') > -1 ? item.gcFile : (baseURL+item.filePath)" alt="影像资料" />
                </div>
            </div>
            <div class="remark-wrap">
                <h3 class="title">查重记录</h3>
                <ul class="remark-box style1">
                    <li v-for="(item, index) in remarkList" :key="index">{{item.time}} {{item.time ? item.userRole >= 1 && item.userRole <= 3 ? 'FS-' : '供应商-' : ''}}{{item.userName}} {{item.gcStatusRemark}}</li>
                </ul>
            </div>
            <!-- <div v-if="row && row.needFillFields && row.needFill">
                <h3 class="title">补充字段</h3>
                <p>{{row && row.needFillFields && row.needFillFields.join(',')}}</p>
            </div>
            <div v-if="row && row.remark && row.needFill">
                <h3 class="title">打回备注</h3>
                <p>{{row && row.remark}}</p>
            </div>
            <div v-if="row && row.setInReason">
                <h3 class="title">待提交原因</h3>
                <p>{{row && row.setInReason}}</p>
            </div> -->
            <div class="foot-box" v-if="orgAdmin == 'admin' && active == 3">
                <el-button size="medium" @click="close">取消</el-button>
                <el-button type="primary" size="medium" @click="saveData">提交</el-button>
            </div>
        </div>
        <div class="preview-images-wrap" v-if="simplePath">
            <i class="left el-icon-arrow-left" :class="{active: currentIndex === 0}" @click="previewImages(currentIndex - 1)"></i>
            <img class="large-image" :src="simplePath" alt="" />
            <i class="close el-icon-close" @click="closePreview"></i>
            <i class="left right el-icon-arrow-right" :class="{active: currentIndex === sourceList.length - 1}" @click="previewImages(currentIndex + 1)"></i>
        </div>
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import uploadFile from "../upload/upload.js";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "annexModal",
    props:{
        gid:{
            type: String,
        },
        active:{
            type: Number,
        },
        createUser:{
            type: String,
        },
        row: {
            type: Object,
        }
    },
    data: () => {
        return {
            qiniuToken: '',
            sourceList: [],
            currentIndex: -1,
            simplePath: '',
            needFillFields: [],
            remark: '',
            remarkList: [],
            detail: {},
            gcStatusRemark: '',
        };
    },
    mounted:function(){
        this.getGenealogyDetail();
        this.getImage();
    },
    methods:{
        async getGenealogyDetail(){
            const result = await api.getAxios('data/detail?dataKey='+this.gid);
            if(result.status == 200){
                this.detail = result.data;
                this.needFillFields = result.data.needFillFields || [];
                this.remark = result.data.remark;
                if(this.remark || this.needFillFields.length){
                    this.remarkList.push({'gcStatusRemark': '补充字段: '+(this.needFillFields.length ? this.needFillFields.join()+',' : '')+(this.remark ? ''+this.remark+';' : ';')});
                }
                this.getGCStatusRemarkList();
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' });
            }
        },
        async getGCStatusRemarkList(){
            const result = await api.getAxios('review/gcStatusRemarkList?gcKey='+this.gid);
            if(result.status == 200){
                let remarkList = result.data.map((ele) => {
                    ele.time = ADS.getLocalTime(ele.time);

                    return ele;
                });
                this.remarkList = this.remarkList.concat(remarkList);
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' });
            }
        },
        saveData(){
            this.$confirm('确认要提交该补充说明吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.patchStatus();
            }).catch(() => {});
        },
        async patchStatus(){//待议谱修改
            let result = await api.patchAxios('v3/review/catalog/status',{'catalogKey': this.gid, 'gcStatus': '23', 'condition': '', 'Dupbookid': '', 'gcStatusRemark': this.gcStatusRemark,'orgKey': this.orgId, 'userKey': this.userId, 'siteKey': this.stationKey});
            if(result.status == 200){
                this.remarkList = [];
                this.getGenealogyDetail();
                this.$XModal.message({ message: '提交成功', status: 'success' });
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' });
            }
        },
        closePreview(){
            this.simplePath = '';
            this.currentIndex = -1;
        },
        previewImages(i){
            console.log(i);
            if(i >= 0 && i <= this.sourceList.length - 1){
                this.currentIndex = i;
                this.simplePath = this.sourceList[i].gcFile && this.sourceList[i].gcFile.indexOf('https://cdn-icare.qingtime.cn') > -1 ? this.sourceList[i].gcFile : (this.baseURL+this.sourceList[i].filePath);
            }
        },
        close(){
            this.$emit('close-annex',false);
        },
        getImage:async function(type=true){//图片列表
            let data=await api.getAxios('catalog/file?page=1&limit=100&catalogKey='+this.gid);
            if(data.status == 200){
                this.sourceList = data.result.list;
            }
        },
        uploadImg: async function(e) {
            let files = Array.from(e.target.files);
            this.uploadImage(files);
        },
        uploadImage(files){
            if(files && files.length){
                let file = files.shift();
                let fd = new FormData();
                fd.append('file', file);
                this.uploadApi(fd, files);
            }
        },
        async uploadApi(fd, files){
            let result = await api.postAxios('upload', fd);
            if(result.statusCode == 200){
                this.linkSource(result.filePath, result.originalName, result.simplePath, files);
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' })
            }
        },
        linkSource:async function(filePath, originalName, simplePath, files){//文件关联家谱
            let data=await api.postAxios('catalog/file',{'catalogKey':this.gid,'userKey':this.userId,'siteKey':this.stationKey,'filePath':filePath,'fileName':originalName});
            if(data.status == 200){
                this.$message({message: '影像资料关联成功',type: 'success'});
                // this.sourceList.push({'gcFile':filePath,'fileName':fileName,'_key':data.result});
                this.sourceList.push({'_key': data.result, 'filePath': simplePath, 'fileName': originalName, 'simplePath': simplePath});
                if(files && files.length){
                    this.uploadImage(files);
                }
            }else{
                this.$message({message: '影像资料关联失败，请重新关联',type: 'warning'});
            }
        },
        deleteSource:async function(index,fileKey){//删除
            let data=await api.deleteAxios('catalog/file',{'fileKey':fileKey,'userKey':this.userId,'siteKey':this.stationKey});
            if(data.status == 200){
                this.sourceList.splice(index,1);
            }else{
                this.$message({message: '删除影像关联出错，请重新删除',type: 'warning'});
            }
        },
    },
    computed: {
        ...mapState({
            TOKEN: state => state.nav.TOKEN,
            userId: state => state.nav.userId,
            stationKey: state => state.nav.stationKey,
            baseURL: state => state.nav.baseURL,
            orgId: state => state.nav.orgId,
            orgAdmin: state => state.nav.orgAdmin,
        })
    },
};
</script>
<style scoped lang="scss">
.style1::-webkit-scrollbar-track{
	border-radius: 2px;
	background-color: #F6FAFD;
}
.style1::-webkit-scrollbar{
	width: 4px;
	background-color: #F6FAFD;
}
.style1::-webkit-scrollbar-thumb{
	border-radius: 2px;
	background: #358acd;
}
.style1::-webkit-scrollbar-corner{
	background-color: #F6FAFD;
}
.annex-modal-wrap{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,0.3);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    .annex-modal-box{
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        max-width: 600px;
    }
}
.annex-modal-title{
    position: relative;
    width: 600px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    i{
        position: absolute;
        top: 10px;
        right: 0;
        font-size: 20px;
        cursor: pointer;
    }
}
.upload_wrap{
    position: relative;
    width: 100px;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
    background: #4C95FF;
    color: #fff;
    cursor: pointer;
    overflow: hidden;
    text-align: center;
    input{
        opacity: 0;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
    i{
        margin-right: 5px;
    }
}
.image_wrap{
    background: #F6FAFD;
    padding: 10px;
    margin: 0 auto;
    max-height: 300px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    .image_box{
        position: relative;
        width: 100px;
        height: 100px;
        margin: 10px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background-color: #f1f1f1;
        img{
            max-width: 100%;
            max-height: 100%;
            cursor: pointer;
        }
        i{
            position: absolute;
            top: 5px;
            right: 5px;
            font-size: 20px;
            cursor: pointer;
        }
    }
}
.title{
    margin: 10px 0 10px 10px;
}
.preview-images-wrap{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    .large-image{
        position: relative;
        height: 100%;
        display: block;
        cursor: pointer;
    }
    .close{
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 40px;
        cursor: pointer;
        color: #fff;
    }
    .left{
        position: absolute;
        color: #fff;
        font-size: 40px;
        cursor: pointer;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        &.active{
            display: none;
        }
    }
    .right{
        left: auto;
        right: 20px;
    }
}
.remark-wrap{
    position: relative;
    width: 100%;
    height: 160px;
    .title{
        text-align: left;
    }
    .remark-box{
        height: 130px;
        overflow-y: auto;
        li{
            margin-bottom: 5px;
        }
    }
}
.memo-box{
    position: relative;
    width: 100%;
    .memo-left{
        position: relative;
        height: 40px;
        display: flex;
        align-items: center;
    }
    .title{
        height: 40px;
        line-height: 40px;
    }
    .memo{
        position: relative;
        width: calc(100% - 12px);
        height: 50px;
        outline: none;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
}
.content-head{
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    .head-left{
        display: flex;
        align-items: center;
        margin-left: 20px;
    }
}
.foot-box{
    position: relative;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

