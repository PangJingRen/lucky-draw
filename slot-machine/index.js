$.fn.extend({
  luckGame: function (options) {
    var defaults = {
      sameTimeBegin: 1, //是否同時開啟
      duration: 5000, // 動畫時間
      gameLen: "18", //产品抽奖数量，
      game_pagesize: 10, // 輪播幾輪顯示結果
      lottery_arr_init: [], // 默认显示奖品数组
      lottery_arr_number: [], // 中奖结果数组
      game_prize_box: ".game-prize-box ", //奖品盒子
      game_prize_ul: ".game-prize-ul", //奖品数组ul
      game_img_root: [
        "./img/1.png",
        "./img/2.png",
        "./img/3.png",
        "./img/4.png",
        "./img/5.png",
        "./img/6.png",
        "./img/7.png",
        "./img/8.png",
        "./img/9.png",
        "./img/10.png",
      ], //獎品圖片
      start: function () {
        // 開始時的函數
      },
      end: function (result) {
        // 結束時的函數
      },
    };
    var settings = $.extend(defaults, options);
    var w_config = {
      w: $(window).width(),
      h: $(window).height(),
    };
    var gameArr = [];
    var gameLen = settings.game_img_root.length;
    var game_list_h = "";
    var game_init = [];
    var game_list_item_h = 0;
    game_init = settings.lottery_arr_init;
    createGame();
    $(window).resize(function () {
      createGame();
    });

    function createGame() {
      getHeight();
      setLi();
      pushLi(gameArr);
    }

    function getHeight() {
      w_config = {
        w: $(window).width(),
        h: $(window).height(),
      };
      game_list_item_h = $(settings.game_prize_box).height();
    }

    // 設置 li
    function setLi() {
      for (var j = 0; j < settings.game_pagesize; j++) {
        for (var i = 0; i < settings.game_img_root.length; i++) {
          gameArr.push({
            type: j,
            index: i,
            src: settings.game_img_root[i],
          });
        }
      }
    }
    // 顯示默認圖片
    function pushLi(arr) {
      var html_str = "";
      for (var i = 0; i < arr.length; i++) {
        html_str +=
          '<li style="height:' +
          game_list_item_h +
          'px" data-index="' +
          arr[i]["index"] +
          '"><img src="' +
          arr[i]["src"] +
          '"></li>';
      }
      $(settings.game_prize_ul).each(function (e) {
        $(this).empty().append(html_str);
        game_list_h = $(this).height();
        var y = game_list_item_h * game_init[e];
        $(this).css({
          "margin-top": -y,
        });
      });
    }

    var scrollFlag = true;
    // 開始抽獎
    this.start = function () {
      if (!scrollFlag) {
        return;
      }
      scrollFlag = false; // 抽獎時禁止再抽獎
      pushLi(gameArr);
      var _this = this;
      $(settings.game_prize_ul).each(function (e) {
        setTimeout(
          function () {
            var y =
              (_this.lottery_arr_number[e] +
                gameLen * (settings.game_pagesize - 1)) *
              game_list_item_h;
            $(settings.game_prize_ul)
              .eq(e)
              .animate(
                {
                  "margin-top": -y,
                },
                settings.duration,
                "swing",
                function () {
                  if ($(this).parent().attr("data-index") == "3") {
                    settings.end({
                      prize: _this.lottery_arr_number,
                    });
                    scrollFlag = true;
                  }
                }
              );
          },
          settings.sameTimeBegin ? 10 : e * 300
        );
      });
    };
    return this.each(function () {
      var obj = $(this);
    });
  },
});
