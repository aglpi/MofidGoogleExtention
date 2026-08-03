var AGLPIObject = {
    UrlPage: window.location.host.toLowerCase(),
    Startup: function () {
        let HtmlPopup = "<div id='AGLPI_PopupBourse'><h6> افزونه های کمکی </h6>";
        if (AGLPIObject.UrlPage == "sinatrader.ir" || AGLPIObject.UrlPage == "atisaz.exirbroker.com") {
            HtmlPopup += '<button id="Aglpi_btn_Vol" class="Aglpi_btn" > نمایش حجم حقیقی و حقوقی در صفحه </button>';
        }
        if (AGLPIObject.UrlPage == "www.nahayatnegar.com") {
            HtmlPopup += "<div id='AglpiFormDataRequst' >"
            HtmlPopup += '<input id="Aglpi_txt_Amount" type="text" placeholder="مبلغ سفارش به میلیون تومان">';
            HtmlPopup += '<input id="Aglpi_txt_Time" type="text" placeholder="زمان ارسال" value="08:44:57">';
            HtmlPopup += '<input id="Aglpi_txt_TimeMS" type="number" placeholder="میلی ثانیه ارسال" value="700">';
            HtmlPopup += '<button id="Aglpi_btn_BuyerSend" class="Aglpi_btn" > ثبت سفارش خرید </button>';
            HtmlPopup += "</div>";
        }
        HtmlPopup += "</div>";

        AGLPIObject.RemoveItem(null);
        $('body').append(HtmlPopup);

        if (AGLPIObject.UrlPage == "d.easytrader.ir") {
            AGLPIObject.VolumeShow.EasyTrader();
        } else {
            $("#Aglpi_btn_Vol").click(function () {
                AGLPIObject.VolumeShow.Opener();
            });

            $("#Aglpi_btn_BuyerSend").click(function () {
                AGLPIObject.SendBuyRequest.Opener(this);
            });
        }
    },
    VolumeShow: {
        LoopTimeMS: 1000,
        Opener: async function (This) {
            debugger;
            switch (AGLPIObject.UrlPage) {
                case "d.easytrader.ir":
                    await AGLPIObject.VolumeShow.EasyTrader();
                    break;
                case "sinatrader.ir":
                    await AGLPIObject.VolumeShow.sinaTrader();
                    break;
                case "atisaz.exirbroker.com":
                    await AGLPIObject.VolumeShow.Atisaz();
                    break;
                default:
                    alert('این سایت تعریف نشده است.')
            }

            AGLPIObject.RemoveItem(This);
        },
        EasyTrader: async function () {
            var item = $("lib-symbol-information-container lib-ind-inst-chart > div.bar-chart.small.w-100");
            console.log($(item).children("div:first-child"));


            var BuyerCount = AGLPIObject.FixNumbersFAToEN($(item).children("div:first-child").children("div:first-child").children().children("span:first-child").text().trim());
            var BuyerVol = AGLPIObject.FixNumbersFAToEN($(item).children("div:first-child").children("div:first-child").children().children("span:last-child").children("span").remove().end().text().trim());
            var SallerCount = AGLPIObject.FixNumbersFAToEN($(item).children("div:first-child").children("div:last-child").children().children("span:first-child").text().trim());
            var SallerVol = AGLPIObject.FixNumbersFAToEN($(item).children("div:first-child").children("div:last-child").children().children("span:last-child").children("span").remove().end().text().trim());
            var AvgClose = AGLPIObject.FixNumbersFAToEN($("#symbol-header-last-span").text().trim());

            var Buyer = BuyerVol * 1.0 / BuyerCount;
            var Seller = SallerVol * 1.0 / SallerCount;
            var RateBuyyer = Buyer / Seller;


            var ComBuyerCount = AGLPIObject.FixNumbersFAToEN($(item).children("div:last-child").children("div:first-child").children().children("span:first-child").text().trim());
            var ComBuyerVol = AGLPIObject.FixNumbersFAToEN($(item).children("div:last-child").children("div:first-child").children().children("span:last-child").children("span").remove().end().text().trim());
            var ComSallerCount = AGLPIObject.FixNumbersFAToEN($(item).children("div:last-child").children("div:last-child").children().children("span:first-child").text().trim());
            var ComSallerVol = AGLPIObject.FixNumbersFAToEN($(item).children("div:last-child").children("div:last-child").children().children("span:last-child").children("span").remove().end().text().trim());

            var ComBuyer = ComBuyerVol * 1.0 / ComBuyerCount;
            var ComSeller = ComSallerVol * 1.0 / ComSallerCount;
            var ComRateBuyyer = ComBuyer / ComSeller;


            var strhtml = '<div class="dashboardprogress-container-AGLPI col-xs-12 col-sm-6 col-md-6 col-lg-6 p-t-15">';

            if (!isNaN(RateBuyyer)) {
                strhtml += '<div class="Aglpi_Vol_Item_Right"> خرید حقیقی ' + parseInt(Buyer * AvgClose / 10000000) + ' میلیون تومان  </div>'
                strhtml += '<div class="Aglpi_Vol_Item_Center" style="background:' + (RateBuyyer > 1.3 ? "lightgreen" : "lightcoral") + '"> نسبت ' + RateBuyyer.toFixed(2) + ' برابر </div>'
                strhtml += '<div class="Aglpi_Vol_Item_Left"> فروش حقیقی ' + parseInt(Seller * AvgClose / 10000000) + 'میلیون تومان </div>';
            }
            if (!isNaN(ComRateBuyyer)) {
                strhtml += '<hr class="AGLPI_W100" />';
                strhtml += '<div class="Aglpi_Vol_Item_Right"> خرید حقوقی ' + parseInt(ComBuyer * AvgClose / 10000000) + ' میلیون تومان  </div>'
                strhtml += '<div class="Aglpi_Vol_Item_Center" style="background:' + (ComRateBuyyer > 1.3 ? "lightgreen" : "lightcoral") + '"> نسبت ' + ComRateBuyyer.toFixed(2) + ' برابر </div>'
                strhtml += '<div class="Aglpi_Vol_Item_Left"> فروش حقوقی ' + parseInt(ComSeller * AvgClose / 10000000) + 'میلیون تومان </div>';
            }

            strhtml += '</div>';

            $(".dashboardprogress-container-AGLPI").remove();
            $("#AGLPI_PopupBourse").append(strhtml);

            setTimeout(async () => {
                await AGLPIObject.VolumeShow.EasyTrader()
            }, 500);
        },
        sinaTrader: async function () {
            var item = $("table.table.table-hover.buy-sell-person-company-table > tbody tr:last-child > td");
            var Queue = $($(" table.table.table-hover.bidasks > tbody > tr")[0]).children();

            var BuyerCount = AGLPIObject.FixNumbersFAToEN($(item[0]).children('span').text());
            var BuyerVol = AGLPIObject.FixNumbersFAToEN($(item[1]).children('span').text());
            var SallerCount = AGLPIObject.FixNumbersFAToEN($(item[6]).children('span').text());
            var SallerVol = AGLPIObject.FixNumbersFAToEN($(item[5]).children('span').text());
            var AvgClose = AGLPIObject.FixNumbersFAToEN($($($(".data-box.no-padding > table.table.normal-layout-table.table-hover.data-table > tbody.symbol-price-info > tr:first-child > td")[1]).children('span')[0]).text());

            var Buyer = BuyerVol * 1.0 / BuyerCount;
            var Seller = SallerVol * 1.0 / SallerCount;

            var RateBuyyer = Buyer / Seller;

            var BuyerCountSAF = AGLPIObject.FixNumbersFAToEN($(Queue[0]).children('span').text());
            var BuyerVolSAF = AGLPIObject.FixNumbersFAToEN($(Queue[1]).find('span').text());
            var BuyerCloseSAF = AGLPIObject.FixNumbersFAToEN($(Queue[2]).find('span').text());

            var SellerCountSAF = AGLPIObject.FixNumbersFAToEN($(Queue[5]).children('span').text());
            var SellerVolSAF = AGLPIObject.FixNumbersFAToEN($(Queue[4]).find('span').text());
            var SellerCloseSAF = AGLPIObject.FixNumbersFAToEN($(Queue[3]).find('span').text());

            var BuyerSAF = BuyerVolSAF * 1.0 / BuyerCountSAF;
            var SellerSAF = SellerVolSAF * 1.0 / SellerCountSAF;

            // var RateBuyyerSAF  = BuyerSAF / SellerSAF;


            var strhtml = '<div class="dashboard-progress-container-AGLPI col-xs-12 col-sm-6 col-md-6 col-lg-6 p-t-15">';

            if (!isNaN(RateBuyyer)) {
                strhtml += '<div class="Aglpi_Vol_Item_Right"> خرید حقیقی ' + parseInt(Buyer * AvgClose / 10000000) + ' میلیون تومان  </div>'
                strhtml += '<div class="Aglpi_Vol_Item_Center" style="background:' + (RateBuyyer > 1.3 ? "lightgreen" : "lightcoral") + '"> نسبت ' + RateBuyyer.toFixed(2) + ' برابر </div>'
                strhtml += '<div class="Aglpi_Vol_Item_Left"> فروش حقیقی ' + parseInt(Seller * AvgClose / 10000000) + 'میلیون تومان </div>';
            }
            if (!isNaN(BuyerSAF)) {
                strhtml += '<div class="Aglpi_VolSaf_Item_Buy"> میانگین مبلغ هر سفارش خرید ' + parseInt(BuyerSAF * BuyerCloseSAF / 10000000) + ' میلیون تومان  </div>';

            }
            if (!isNaN(SellerSAF)) {
                strhtml += '<div class="Aglpi_VolSaf_Item_Sale"> میانگین مبلغ هر سفارش فروش ' + parseInt(SellerSAF * SellerCloseSAF / 10000000) + ' میلیون تومان  </div>';
            }

            strhtml += '</div>';

            $(".dashboard-progress-container-AGLPI").remove();
            $(strhtml).insertAfter(".dashboard-progress-container");


            setTimeout(async () => {
                await AGLPIObject.VolumeShow.sinaTrader()
            }, AGLPIObject.VolumeShow.LoopTimeMS);
        },
        Atisaz: async function () {

            var item = $(" table#natural-legal-table > tbody tr:first-child > td > ");
            var item1 = $($(" table.main-table > tbody > tr")[2]).children();

            var BuyerCount = AGLPIObject.FixNumbersFAToEN($(item[0]).children('span > div').text());
            var BuyerVol = AGLPIObject.FixNumbersFAToEN($(item[1]).children('div > span').text() + ' ' + $(item[1]).children('p.ng-star-inserted').text());
            var SallerCount = AGLPIObject.FixNumbersFAToEN($(item[3]).children('span > div').text());
            var SallerVol = AGLPIObject.FixNumbersFAToEN($(item[2]).children('div > span').text() + ' ' + $(item[2]).children('p.ng-star-inserted').text());
            var AvgClose = AGLPIObject.FixNumbersFAToEN($("span.endPrice > div").text());

            var BuyerCountSAF = AGLPIObject.FixNumbersFAToEN($(item1[0]).children('span').text());
            var BuyerVolSAF = AGLPIObject.FixNumbersFAToEN($(item1[1]).find('span').text());
            var AvgCloseSAF = AGLPIObject.FixNumbersFAToEN($(item1[2]).find('span').text());

            //console.log(BuyerVol);
            var Buyer = BuyerVol * 1.0 / BuyerCount;
            var Seller = SallerVol * 1.0 / SallerCount;

            var BuyerSAF = BuyerVolSAF * 1.0 / BuyerCountSAF;

            var RateBuyyer = Buyer / Seller;
            if (!isNaN(RateBuyyer)) {
                var strhtml = '<div class="dashboard-progress-container-AGLPI" style="padding: 10px ; width: 100%">';
                strhtml += "";
                strhtml += '<div class="Aglpi_Vol_Item_Right"> خرید حقیقی ' + parseInt(Buyer * AvgClose / 10000000) + ' میلیون تومان  </div>'
                strhtml += '<div class="Aglpi_Vol_Item_Center" style="background:' + (RateBuyyer > 1.5 ? "lightgreen" : "lightcoral") +
                    '"> نسبت ' + RateBuyyer.toFixed(2) + ' برابر </div>'
                strhtml += '<div class="Aglpi_Vol_Item_Left"> فروش حقیقی ' + parseInt(Seller * AvgClose / 10000000) + 'میلیون تومان </div>'
                strhtml += '</div>';

                strhtml += '<div class="Aglpi_VolSaf_Item"> میانگین مبلغ هر سفارش در صف ' + parseInt(BuyerSAF * AvgCloseSAF / 10000000) + ' میلیون تومان  </div>'


                $("#td-tradesDirection").children().remove();
                $("#td-tradesDirection").html(strhtml);


            }

            setTimeout(async () => {
                await AGLPIObject.VolumeShow.Atisaz()
            }, AGLPIObject.VolumeShow.LoopTimeMS);
        }
    },
    SendBuyRequest: {
        MiliSecound: 9,
        MiliSecoundSend: 0,
        Opener: async function (This) {
            let Amount = $("#Aglpi_txt_Amount").val();
            let time = $("#Aglpi_txt_Time").val();
            let msStart = $("#Aglpi_txt_TimeMS").val();

            if (!AGLPIObject.CheckSpaceVar(time)
                || !AGLPIObject.CheckSpaceVar(msStart)
                || !AGLPIObject.CheckSpaceVar(Amount)) {
                alert("لطفا تمام مقادری را پر نمایید.");
            }
            else {
                switch (AGLPIObject.UrlPage) {
                    case "www.nahayatnegar.com":
                        await AGLPIObject.SendBuyRequest.NahayatNegarSetOrder(Amount);
                        await AGLPIObject.SendBuyRequest.NahayatNegarTimerSend(time, msStart);
                        break;
                    default:
                        alert('این سایت تعریف نشده است.');
                }

                AGLPIObject.RemoveItem(This);
            }
        },
        NahayatNegarTimerSend: async function (time, msStart) {
            var d = $(".show-clock").text();

            console.log(d);
            if (d >= time) {
                if (AGLPIObject.SendBuyRequest.MiliSecoundSend >= msStart) {
                    console.log(AGLPIObject.SendBuyRequest.MiliSecoundSend);
                    $("button.tiny.button.submit").trigger("click");
                    return;
                } else {
                    AGLPIObject.SendBuyRequest.MiliSecoundSend += 10;
                }
            }

            setTimeout(
                async () => {
                    await AGLPIObject.SendBuyRequest.NahayatNegarTimerSend(time, msStart, -1)
                },
                AGLPIObject.SendBuyRequest.MiliSecound
            );
        },
        NahayatNegarSetOrder: async function (Amount) {
            $($("div.small-8.columns.tab.ng-binding")[1]).trigger("click");

            setTimeout(function () {
                $("input[name=orderRiskStatement]").trigger("click");

                $("div.knot-bar.price.knot-11 > span :last-child").last().trigger("click");

                let fee = AGLPIObject.FixNumbersFAToEN($("div.knot-bar.price.knot-11 > div").last().text());

                let count = parseInt(Amount * 10000000 / fee);
                if (count > 1000)
                    count = parseInt(count / 100) * 100;
                $("input[name=orderVolume]").val(count);
                $("input[name=orderVolume]").trigger("change").trigger('input');

            }, 1000);
        }
    },
    RemoveItem: function (This) {
        if (This != null) {
            $(This).remove();
        }

        if ($("#AGLPI_PopupBourse").children(":not(h6)").length == 0) {
            $("#AGLPI_PopupBourse").addClass("AglpiHidden");
        }
    },
    FixNumbersFAToEN: function (str) {
        if (typeof str === 'string') {
            persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
            arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

            for (var i = 0; i < 10; i++) {
                str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
            }

            str = str.replace('٬', '').replace('٬', '').replace('٬', '').replace(',', '').replace(',', '').replace(',', '');
            if (str.indexOf("M") >= 0) {

                let item = parseFloat(str.replace('M', '').replace('٫', '.')) * 1000000;

                return parseInt(item);
            }

        }
        return parseInt(str);
    },
    CheckSpaceVar: function (str) {
        if (str == null || str == 'undefined') {
            return false;
        }
        if (typeof (str) === "string")
            str = str.trim();
        if (!str || 0 === str.length) {
            return false;
        } else {
            return true;
        }
    }
}



AGLPIObject.Startup();

