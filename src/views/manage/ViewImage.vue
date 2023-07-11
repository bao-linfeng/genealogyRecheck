<template>  
    <div class="wrap" @mousemove="mouseLMove" @mouseup="mouseLEnd">
        <div class="head">
            <div class="head-left">
                <p class="genealogyName" :title="genealogyName">{{genealogyName}}({{gid}})</p>
                <el-select class="width150" v-model="vid" placeholder="请选择卷名" size="small">
                    <el-option
                        v-for="item in volumeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select class="width80 marginL10" v-model="imageHref" placeholder="域名提速" size="small">
                    <el-option
                        v-for="item in speedList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <h3 class="title" @click="isShow = 8">{{takeStatusO[takeStatus]}} ({{scale*100}}%)</h3>
            <div class="head-right">
                
            </div>
        </div>
        <div class="content" :style="{height: IH+'px', background: bgColor}">
            <!-- 大图 -->
            <div class="img-box" :class="{active: isZoom, paddingRight340: isShow == 6}">
                <img class="large-image" :class="{active: isNatural}" :style="{transform: 'translate('+x+'px, '+y+'px) rotate('+rotate+'deg) scale('+scale+')'}" @load="loadImage" :src="imageURL+(imageURL.indexOf('gif') > -1 ? '' : '?v='+this.now)" alt="" />
                <div class="img-hand" @mousedown="dragStart" @mousemove.prevent="mouseMove" @wheel.passive="handleWheel"></div>
            </div>
            <!-- 工具栏 -->
            <div class="tool-wrap" @mousedown="mouseLStart">
                <div class="tool-box" @mousedown.stop="" @keyup.stop="">
                    <img class="icon" @click="handleNatural" title="原图查看" :src="require('../../assets/shoot/'+(isNatural ? 'naturalOpen' : 'naturalClose')+'.svg')" alt="">
                    <img class="icon" @click="handleOpenNewView" title="查看单页" :src="require('../../assets/shoot/magnifierOpen.svg')" alt="">
                    <input class="page-input" type="Number" @keyup.enter="imageIndex = page-1" @change="changeImagePage" :value="page" placeholder="页码" />
                    <span class="total">/共{{total}}页</span>
                    <img class="icon" @click="handleRotate(false)" title="左旋90°" src="../../assets/shoot/spinL.svg" alt="">
                    <img class="icon" @click="handleRotate()" title="右旋90°" src="../../assets/shoot/spinR.svg" alt="">
                    <img class="icon" @click="handleZoom(false)" title="缩小" src="../../assets/shoot/zoomIn.svg" alt="">
                    <img class="icon" @click="handleZoom()" title="放大" src="../../assets/shoot/zoomOut.svg" alt="">
                    <img class="icon" @click="handleReset" title="重置" src="../../assets/shoot/reset.svg" alt="">
                </div>
            </div>
            <i class="el-icon-arrow-left prev" @click="changeImage(imageIndex - 1)"></i>
            <i class="el-icon-arrow-right next" @click="changeImage(imageIndex + 1)"></i>
        </div>
        <div class="foot style3" :style="{height: TH+'px'}">
            <!-- 缩略图 -->
            <div class="thumbnail-box" :class="{active: imageIndex === index}" v-for="(item,index) in imageList" :key="index" :id="index" @click="changeImage(index)">
                <img class="lazyload" :data-src="imageHref+(item.thumbnail || item.name)" :src="imageGif" alt="" />
                <div class="page-box">
                    <i>{{index+1}}</i>
                </div>
                <img class="attachedSheet" v-if="item.attachedSheet == 1" title="附页" src="../../assets/shoot/attachedSheetA.svg" alt="">
            </div>
        </div>
        <!-- 放大镜 -->
		<div class="magnifier-box" v-show="isMagnifier == 1" :style="{top: (magnifierY+30)+'px', left: (magnifierX+30)+'px', width: magnifierW+'px', height: magnifierH+'px'}">
			<img class="magnifier" :style="{top: magnifierNaturalY+'px', left: magnifierNaturalX+'px', height: zoomLevel*imgNH+'px'}" :src="imageURL" alt="">
		</div>
        <!-- loading -->
        <Loading class="image-loading" v-show="loading" />
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import { mapState, mapActions, mapGetters } from "vuex";
import PassModule from '../../components/takeCamera/PassModule.vue';
import VolumeReturnReason from '../../components/takeCamera/VolumeReturnReason.vue';
import ComplainVolumeModule from '../../components/takeCamera/ComplainVolumeModule.vue';
import DORModule from '../../components/takeCamera/DORModule.vue';
import EditVolume from '../../components/takeCamera/EditVolume.vue';
import CatalogView from '../../components/takeCamera/CatalogView.vue';
import EditCatalog from '../../components/takeCamera/EditCatalog.vue';
import ImagesCheck from '../../components/takeCamera/ImagesCheck.vue';
import ImageView from '../../components/takeCamera/ImageView.vue';
import ReshootImages from '../../components/takeCamera/ReshootImages.vue';
import ImageMoveModule from '../../components/takeCamera/ImageMoveModule.vue';

export default {
    name: "viewImage",
    components: {
        PassModule, VolumeReturnReason, ComplainVolumeModule, DORModule, EditVolume, CatalogView, ImagesCheck, EditCatalog, ImageView, ReshootImages, ImageMoveModule,
    },
    data: () => {
        return {
            vid: '',
            imageList: [],
            imageGif: 'data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs',
            imageURL: '',
            pageKey: '',
            imageIndex: 0,
            isZoom: false,
            rotate: 0,
            scale: 1,
            pointerX: 0,
            pointerY: 0,
            x: 0,
            y: 0,
            takeStatus: '',
            isShow: 0,
            page: 1,
            dataKey: '',
            takeStatusO: {
                '5': '微站初审',
                '12': '机构审核',
                '6': '打回中',
                '7': '审核通过',
                '13': '微站复审',
                '14': '微站待议',
                '8': '审核通过',
                '9': '审核通过',
                '16': '已作废',
                '': ''
            },
            isMagnifier: 0,
            magnifierW: 300,
            magnifierH: 300,
            magnifierX: 0,
            magnifierY: 0,
            magnifierNaturalX: 0,
            magnifierNaturalY: 0,
            windowW: window.innerWidth,
            windowH: window.innerHeight,
            imgW: 0,
            imgH: 0,
            imgNW:0,
            imgNH:0,
            zoomLevel: 1,
            Y: 0,
            thumbnailH: 100,
            isMouseMove: false,
            isNatural: false,
            TH: 100,
            IH: window.innerHeight - 40 - 100,
            bgColor: '#ecc48b',
            volumeList: [],
            precentList: [
                {'label': '100%', 'value': 1},
                {'label': '40%', 'value': 0.4},
            ],
            total: 0,
            loading: false,
            isFirst: true,
            genealogyName: '',
            gid: '',
            isRead: '',
            isShowSideBar: false,
            pageLimit: 10,
            now: 0,
            speedList: [
                {'label': '线路1', 'value': 'https://genealogyimagestest.qingtime.cn/photo'}
            ],
            imageHref: 'https://genealogyimagestest.qingtime.cn/photo',
        };
    },
    created:function(){
        this.gid = ADS.getQueryVariable('gid');
        this.genealogyName = ADS.getQueryVariable('genealogyName') ? decodeURIComponent(ADS.getQueryVariable('genealogyName')) : '';
        
        if(window.location.origin.indexOf('genealogy.1jiapu.com') > -1){
            this.imageHref = 'https://photo.1jiapu.com/photo';
            this.speedList = [
                {'label': '线路1', 'value': 'https://photo.1jiapu.com/photo'},
                {'label': '线路2', 'value': 'http://223.111.180.111:8085/photo'},
            ]
        } 
    },
    mounted:function(){
        const enterKeyUp = () => {
            document.addEventListener('keyup', this.enterKey);
        }
        enterKeyUp();

        this.getVolumeList(this.gid);
    },
    beforeDestroy: function(){
        const enterKeyUpDestoryed = () => {
            document.removeEventListener('keyup', this.enterKey);
        }
        enterKeyUpDestoryed();
    },
    methods:{
        handleOpenNewView(){
            window.open(this.imageURL, '_blank');
        },
        handleNatural(){                          
			this.isMagnifier = 0;
			this.isNatural = !this.isNatural;
			this.scale = 1;
			this.rotate = 0;
			this.x = 0;
			this.y = 0;
            this.zoomLevel = 1;
			this.TH = this.thumbnailH || 100;
			this.IH = window.innerHeight - 40 - this.thumbnailH;
		},
        mouseMove(e){
			if(this.isMagnifier != 1){
				return;
			}
			this.magnifierX = e.clientX;
			this.magnifierY = e.clientY;
			this.magnifierNaturalX = -(e.clientX - (this.windowW - this.imgW)/2)*this.imgNW*Number(1 || this.zoomLevel)/this.imgW+this.magnifierW/2;
			this.magnifierNaturalY = -(e.clientY - 60)*this.imgNH*Number(1 || this.zoomLevel)/this.imgH;
		},
        handleMagnifier(){// 切换放大镜模式
			this.isMagnifier = this.isMagnifier == 1 ? 0 : 1;
			this.isNatural = false;
			this.scale = 1;
			this.rotate = 0;
			this.x = 0;
			this.y = 0;
            this.zoomLevel = 1;
			this.TH = this.thumbnailH || 100;
			this.IH = window.innerHeight - 40 - this.thumbnailH;
		},
        loadImage(e){//大图加载
            console.log(e.target.width, e.target.height, e.target.naturalWidth, e.target.naturalHeight);
            this.loading = false;
        },
        async getVolumeList(dataKey){// 卷册列表
            const result = await api.getAxios('catalog/volumeList?catalogKey='+dataKey);
            if(result.status == 200){
                let volumeList = [];
                let takeStatusOO = {'1': '待拍摄', '2': '拍摄中', '3': '自检中', '4': '同步中', '5': '初审', '6': '打回中', '7': '完成', '8': '开发票中', '12': '审核', '13': '复审', '14': '待议', '15': '', '16': '作废'};
                result.data.forEach((ele) => {
                    ele.takeStatusO = takeStatusOO[ele.takeStatus];
                    ele.label = ele.volumeNumber+'('+ele.takeStatusO+')';
                    ele.value = ele._key;

                    volumeList.push(ele);
                });

                volumeList = volumeList.sort((a, b) => {return a.internalSerialNumber - b.internalSerialNumber});
                this.volumeList = volumeList;
                this.vid = volumeList[0]._key;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' });
            }
        },
        
        async getImageList(){// 影像列表
            this.imageList =  [];
            let result = await api.getAxios('review/page/list?volumeKey='+this.vid);
            if(result.status == 200){
                if(!result.data.length){return;}
                this.imageList = result.data.map((ele) => {
                    ele.returnPageTimeO = ele.returnPageTime ? ADS.getLocalTime(ele.returnPageTime) : '';
                    return ele;
                });
                this.imageURL = this.imageHref + this.imageList[this.imageIndex].name;
                this.total = this.imageList.length;

                this.Observer();
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        mouseLStart(e){
			if(this.isMagnifier == 1){
				return;
			}
			this.Y = e.clientY;
			this.isMouseMove = true;
		},
        mouseLMove(e){
			let nowY = 0;
			let disY = 0;
			nowY = e.clientY;
			disY = nowY - this.Y;
			if(!this.isMouseMove){
				return;
			}
			this.Y = nowY;
			this.TH = this.TH - disY;
			this.IH = this.IH + disY;
		},
        mouseLEnd(e){
			if(!this.isMouseMove){
				return;
			}
			this.isMouseMove = false;

            this.handleScrollIntoView(this.imageIndex);
		},
        handleScrollIntoView(i){
            this.$nextTick(() => {
                document.getElementById(i).scrollIntoView({
                    behavior: "smooth",  // 平滑过渡
                    block: "start",    // 上边框与视窗顶部平齐
                    inline: "end"
                });
            });
        },
        handleWheel(e){
            if(e.deltaY > 0){
                if(this.scale >= 1.25){
                    this.handleZoom(false);
                }
            }
            if(e.deltaY < 0){
                this.handleZoom();
            }
        },
        enterKey(event){
            const keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
            // console.log(keyCode);
            // 左、上
            if(keyCode == 37 || keyCode == 38){
                if(this.imageIndex >= 1){
                    this.changeImage(this.imageIndex - 1);
                }else{
                    ADS.message('第一页了');
                }
            }
            // 右、下
            if(keyCode == 39 || keyCode == 40){
                if(this.imageIndex < this.imageList.length - 1){
                    this.changeImage(this.imageIndex + 1);
                }else{
                    ADS.message('末一页了');
                }
            }
        },
        changeImagePage(e){
            if(e.target.value >= this.imageList.length){
                this.page = this.imageList.length;
                this.imageIndex = this.page - 1;
            }else if(e.target.value <= 1){
                this.page = 1;
                this.imageIndex = 0;
            }else{
                this.page = Number(e.target.value);
                this.imageIndex = this.page - 1;
            }

            this.pageKey = this.imageList[this.imageIndex]._key;
            this.imageURL = this.imageHref + this.imageList[this.imageIndex].name;

            this.handleScrollIntoView(this.pageLimit + this.imageIndex <= this.imageList.length ? this.pageLimit + this.imageIndex : this.imageIndex);
        },
        dragStart(ev){
            this.pointerX = ev.clientX;
            this.pointerY = ev.clientY;
            document.onmousemove = (e)=>{
                let nowX = 0, nowY = 0;
                nowX = e.clientX - this.pointerX;
                nowY = e.clientY - this.pointerY;
                this.x = this.x + nowX;
                this.y = this.y + nowY;
                this.pointerX = e.clientX;
                this.pointerY = e.clientY;
            };
            document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        },
        handleReset(){
            this.scale = 1;
            this.rotate = 0;
            this.x = 0;
            this.y = 0;
            this.zoomLevel = 1;
            this.isMagnifier = 0;
			this.isNatural = false;
        },
        handleRotate(f = true){
            let rotate = 90;
            if(f){
                this.rotate = this.rotate + rotate;
            }else{
                this.rotate = this.rotate - rotate;
            }
        },
        handleZoom(f = true){
            if(f){
                this.scale = this.scale + 0.25;
            }else{
                if(this.scale >= 1.25){
                    this.scale = this.scale - 0.25;
                }else{
                    this.$XModal.message({message: '已经最小尺寸啦', status: 'warning'})
                }
            }
        },
        changeImage(i){
            if(i < 0){
                return ADS.message('首一页了！');
            }
            if(i >= this.imageList.length){
                return ADS.message('末一页了！');
            }
            this.imageIndex = i;
            this.page = i + 1;
            this.imageURL = this.imageHref + this.imageList[this.imageIndex].name;
            this.pageKey = this.imageList[this.imageIndex]._key;

            this.handleScrollIntoView(this.imageIndex);
        },
        Observer(){// 图片懒加载
            let timer = setTimeout(() => {
                let images = document.querySelectorAll(".lazyload");
                let observer = new IntersectionObserver(entries => {
                    entries.forEach(item => {
                        if (item.isIntersecting) {
                            item.target.src = item.target.dataset.src; // 开始加载图片,把data-origin的值放到src
                            observer.unobserve(item.target); // 停止监听已开始加载的图片
                        }
                    });
                },{rootMargin: "0px -50px 0px 0px"});
                images.forEach(item => observer.observe(item)); 

                clearTimeout(timer);
                timer = null;
            }, 200);
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
            roleName: state => state.nav.roleName,
            roleKey: state => state.nav.roleKey,
            roleType: state => state.nav.roleType,
        })
    },
    watch:{
        'imageHref': function(){
            this.imageURL = this.imageHref + this.imageList[this.imageIndex].name;
            this.Observer();
        },
        'imageURL': function(){
            this.loading = true;
            this.now = Date.now();
        },
        'vid': function(nv, ov){
            console.log(nv);
            this.imageURL = this.imageGif;
            this.imageIndex = 0;
            this.imageList =  [];
            this.page = 1;
            this.isFirst = true;

            this.handleReset();// 重置
            this.getImageList();// 影像列表
        },
        'zoomLevel': function(nv ,ov){
            this.scale = Number(nv);
            console.log(this.scale);
            if(nv == 23){
                if(this.isNatural){
                    
                }else{
                    this.x = (this.isNatural ? this.imgNW : this.imgW)*(nv)/2 - window.innerWidth/2;
                    this.y = (this.isNatural ? this.imgNH : this.imgH)*(nv - 1)/2;
                }
            }else{
                this.x = 0;
                this.y = 0;
            }
        },
        'isShow': function(nv, ov){
            if(nv == 6){
                this.isShowSideBar = false;
            }else{
                this.isShowSideBar= true;
            }
        },
    },
};
</script>
<style scoped lang="scss">
.wrap{
    position: relative;
    width: 100%;
    height: 100%;
    // background: #000;
    color: #fff;
    overflow: hidden;
    .head{
        position: relative;
        width: calc(100% - 40px);
        padding: 0 20px;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #404040;
        .head-left{
            position: relative;
            display: flex;
            align-items: center;
            .genealogyName{
                margin: 0 10px;
            }
        }
        .back{
            cursor: pointer;
            display: block;
        }
        .title{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .head-right{
            position: relative;
            height: 100%;
            display: flex;
            align-items: center;
            font-style: normal;
            .task-verify{
                position: relative;
                height: 100%;
                padding: 0 10px;
                display: flex;
                align-items: center;
                font-style: normal;
                cursor: pointer;
                &.active{
                    background: #000;
                }
                &:hover{
                    background: #000;
                }
            }
            .span{
                margin-left: 5px;
            }
        }
    }
    .content{
        position: relative;
        width: 100%;
        height: calc(100% - 140px);
        // padding-bottom: 40px;
        display: flex;
        justify-content: center;
        // align-items: center;
        .img-box{
            position: relative;
            overflow: hidden;
            height: calc(100% - 40px);
            width: 100%;
            margin-top: 5px;
            &.active{
                overflow: auto;
            }
            .img-hand{
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
            }
            &.paddingRight340{
                width: calc(100% - 440px);
                padding-right: 440px;
            }
        }
        .large-image{
            height: 100%;
            display: block;
            margin: 0 auto;
            &.active{
                height: auto;
                transform-origin: 0 0;
            }
        }
        .pass-wrap{
            position: absolute;
            top: 1px;
            bottom: 0;
            width: 200px;
            left: 0;
            background: #404040;
            text-align: left;
            padding: 10px 0 0 10px;
            overflow-y: auto;
            h3{
                margin-bottom: 5px;
            }
            p{
                position: relative;
                padding: 5px;
                margin: 0 5px 0 0;
                &::before{
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    background: #fff;
                    opacity: 0.1;
                }
                cursor: pointer;
                &.active{
                    color: #85b83e;
                }
            }
            .repulseRecord-box{
                margin-bottom: 10px;
                span{
                    opacity: 0.3;
                    font-size: 12px;
                }
            }
            .content-top{
                position: relative;
                width: 100%;
                height: calc(100% - 70px);
                overflow-y: auto;
            }
            .content-bottom{
                position: relative;
                width: 100%;
                height: 40px;
                overflow-y: auto;
            }
        }
    }
    .foot{
        position: relative;
        width: 100%;
        height: 100px;
        // background: #232323;
        width: calc(100% - 40px);
        padding: 0 20px;
        overflow-x: auto;
        display: flex;
        align-items: center;
        .thumbnail-box{
            position: relative;
            height: calc(100% - 20px);
            margin-right: 10px;
            // min-width: 50px;
            display: block;
            cursor: pointer;
            .attachedSheet{
                position: absolute;
                top: 0;
                left: 0;
                width: 20px;
                cursor: pointer;
            }
            .lazyload{
                height: 100%;
            }
            &.active{
                border: 5px solid #85b83e;
                height: calc(100% - 30px);
            }
            .page-box{
                position: absolute;
                width: 100%;
                height: 20px;
                bottom: 0;
                left: 0;
                // background: rgba(0,0,0,0.6);
                display: flex;
                justify-content: center;
                align-items: center;
                // backdrop-filter: blur(8px);
                i{
                    color: #fff;
                    font-weight: bold;
                    font-style: normal;
                }
            }
            .check{
                position: absolute;
                top: 2px;
                right: 2px;
                width: 18px;
                height: 18px;
                cursor: pointer;
                border: 1px solid #f00;
                &.active{
                    background: url('../../assets/shoot/tick_red.svg') 50% 50% no-repeat;
                    background-size: cover;
                }
            }
        }
    }
}
.s-fold{
    position: absolute;
    top: 10px;
    right: 10px;
    height: 20px;
    cursor: pointer;
}
.s-unfold{
    position: absolute;
    top: 50px;
    left: 10px;
    height: 20px;
    cursor: pointer;
    z-index: 1000;
}
.tool-wrap{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(53, 138, 205, 0.5);
    cursor: pointer;
}
.tool-box{
    position: relative;
    height: 30px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    // background: #333;
    .icon{
        height: 20px;
        margin: 0 10px;
        cursor: pointer;
    }
    .page-input{
        width: 80px;
        height: 20px;
        line-height: 20px;
        text-indent: 10px;
        outline: none;
        border: none;
        margin-left: 10px;
        &.w50{
            width: 50px;
        }
    }
}

// 留言列表
.leave-msg-list{
	position: relative;
	.title{
		font-size: 16px;
	}
	.leave-msg-p{
		margin-bottom: 5px;
		&.active{
			color: #85b83e;
		}
	}
}
.width150{
    width: 120px;
}
.width80{
    width: 80px;
}
.marginL10{
    margin-left: 10px;
}
.magnifier-box{
	position: absolute;
	border: 1px solid #ddd;
	width: 200px;
	height: 200px;
	z-index: 100;
	background: #fff;
	overflow: hidden;
	.magnifier{
		position: absolute;
		display: block;
	}
}
.prev{
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
    font-size: 40px;
    color: #fff;
    cursor: pointer;
}
.next{
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    font-size: 40px;
    color: #fff;
    cursor: pointer;
}
.image-loading{
    top: 50% !important;
    right: auto !important;
    bottom: auto !important;
    left: 50% !important;
    width: 80px;
    height: 80px;
    transform: translate(-50%, -50%);
}
</style>

