const minWidth = 1280;
const docWidth = document.documentElement.clientWidth;
// 如果在[768,1200]区间，使用1200的大小，出现滚动条可以
if (docWidth > 768) {
    document.getElementsByTagName('html')[0].style['font-size'] = (Math.max(document.documentElement.clientWidth, minWidth) / 10) + 'px';
} else {
    document.getElementsByTagName('html')[0].style['font-size'] = document.documentElement.clientWidth / 10 + 'px';
}
window.addEventListener('resize', () => {
    if (docWidth > 768) {
        document.getElementsByTagName('html')[0].style['font-size'] = (Math.max(document.documentElement.clientWidth, minWidth) / 10) + 'px';
    } else {
        document.getElementsByTagName('html')[0].style['font-size'] = document.documentElement.clientWidth / 10 + 'px';
    }
});


<script type="text/javascript">const minWidth=1280;const docWidth=document.documentElement.clientWidth;if(docWidth > 768){document.getElementsByTagName("html")[0].style["font-size"] = (Math.max(document.documentElement.clientWidth, minWidth) / 10) + "px"} else {document.getElementsByTagName("html")[0].style["font-size"] = document.documentElement.clientWidth / 10 +"px"}</script>
