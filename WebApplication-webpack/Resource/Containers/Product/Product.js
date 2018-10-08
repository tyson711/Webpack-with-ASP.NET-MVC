export * from '@Containers/Shared/Shared'
export HomeHotPd from '@Scripts/jsx/Home/homehotpd'
import '@Resource/Sass/Product'

// class Home extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             status: null,
//         }
//     }
//     componentDidMount = () => {
//         $.ajax('/Account/LoginInfo', {
//             dataType: 'json',
//             type: 'post',
//         }).done(data => {
//             this.setState({
//                 status: data,
//                 isShowEHSCoin: this.props.isShowEHSCoin,
//             })
//         })
//     }

//     render() {
//         const { RankProductInfo, StoreProducts, pid, BigDataProducts, TopicPage } = this.props
//         return (
//             <React.Fragment>
//                 <div id="FiveBanner" style={{ height: '340px' }} />
//                 <div className="n-layout--lg">
//                     <div className="n-l-1015 n-m-bottom--sm n-daily-film" id="homed">
//                         {/* @Html.React("Components.HomeDaily", new
//                         {
//                             hourSaleProducts = @Model.HourSaleProducts,
//                             dailySaleProducts = @Model.DailySaleProducts,
//                             isIndex = true
//                         }, containerId: "HomeDailySale", clientOnly: true)
//                         @Html.React("Components.HomeMedia", new { }, containerId: "HomeMediaSale", clientOnly: true) */}
//                     </div>
//                     <div id="HomeChannelPush" />
//                     <div id="HomeChanActivity" />
//                     <div id="HomeStoreChannel" />
//                     <div id="HomeBankRank" />
//                     <div id="myhistory" />
//                     <div id="RecommendProducts" />
//                     <div id="homeHotPdList" />
//                     <div id="TopicPageGrouop" />
//                 </div>
//             </React.Fragment>
//         )
//     }
// }
