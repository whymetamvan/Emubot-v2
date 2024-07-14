const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const buttonPages = require("../events/pagination");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('ヘルプを表示します。'),

    async execute(interaction) {
        const embed1 = new EmbedBuilder()
            .setColor(0xf8b4cb)
            .setTitle('えむbot｜help')
            .setFooter({ text:'Emubot | help', iconURL:'https://royalblossom.nl/img/878735.jpg' })
            .addFields(
                { name: 'えむbotについて', value: '暇な音ゲーマーの作ってる謎多機能botです' },
                { name: 'このメッセージ', value: 'このhelpは放置してると一定期間後に自動で消えます' },
                { name: 'botの便利機能', value: 'メッセージリンクの自動展開\nbotのメンションでMake it a quote画像を生成' },
                { name: 'お知らせチャンネルについて', value: 'えむbot開発室というチャンネルでお知らせを行います。\n作成されていない場合は**/announce create**で作成してください\n作成できない場合は手動でお願いします()' },
                { name: 'サポート等', value: '[twitter](https://twitter.com/ryo_001339)  [Discord](https://discord.gg/j2gM7d2Drp)  [Github](https://github.com/VEDA00133912/Emubot-discord.js-v14/tree/main)' }
            );

        const embed2 = new EmbedBuilder()
            .setTitle("えむbot｜help")
            .setDescription("コマンド一覧（1）")
            .setFooter({ text:'Emubot | help', iconURL:'https://royalblossom.nl/img/878735.jpg' })
            .addFields(
                { name: '**/help**', value: 'help(これ)を表示', inline: true },
                { name: '**/announce**', value: 'お知らせチャンネルの作成', inline: true },
                { name: '**/taiko**', value: '太鼓の達人ランダム選曲', inline: true },
                { name: '**/prsk**', value: 'プロセカランダム選曲', inline: true },
                { name: '**/chunithm**', value: 'CHUNITHMランダム選曲', inline: true },
                { name: '**/icon**', value: 'アイコンを表示', inline: true }
            )
            .setColor(0xf8b4cb);

        const embed3 = new EmbedBuilder()
            .setColor(0xee99ff)
            .setTitle("えむbot｜help")
            .setDescription('コマンド一覧 (2)')
            .setFooter({ text:'Emubot | help', iconURL:'https://royalblossom.nl/img/878735.jpg' })
            .addFields(
                { name: '**/translate**', value: '日本語を翻訳します\n(英、中、韓、露)', inline: true },
                { name: '**/youtube-play**', value: 'ボイスチャンネルで指定したYoutube動画の再生', inline: true },
                { name: '**/ping**', value: 'ping値の表示', inline: true },
                { name: '**/メッセージの自動展開**', value: 'デフォでオンになっているので', inline: true },
                { name: '**/convert**', value: '文字列の変換', inline: true },
                { name: '**/delete**', value: 'メッセージの削除', inline: true }
            )
            .setColor(0xf8b4cb);

        const embed4 = new EmbedBuilder()
            .setColor(0xee99ff)
            .setTitle("えむbot｜help")
            .setDescription('コマンド一覧 (3)')
            .setFooter({ text:'Emubot | help', iconURL:'https://royalblossom.nl/img/878735.jpg' })
            .addFields(
                { name: '**/nitrogen**', value: 'フェイクNitroギフトリンクの生成', inline: true },
                { name: '**/tokengen**', value: 'フェイクtokenの生成', inline: true },
                { name: '**/5000choyen**', value: '5000兆円欲しい!!風画像の生成', inline: true },
                { name: '**/verify**', value: '認証パネルの設置', inline: true },
                { name: '**/omikuji**', value: '1日一回おみくじ', inline: true },
                { name: '**/pi**', value: '指定した桁数の円周率の表示', inline: true }
            )
            .setColor(0xf8b4cb);

        const embed5 = new EmbedBuilder()
            .setColor(0xee99ff)
            .setTitle("えむbot｜help")
            .setDescription('コマンド一覧 (4)')
            .setFooter({ text:'Emubot | help', iconURL:'https://royalblossom.nl/img/878735.jpg' })
            .addFields(
                { name: '**/prime**', value: '素数判定', inline: true },
                { name: '**/qr**', value: 'QRコード生成', inline: true },
                { name: '**/remove**', value: '画像の背景透過', inline: true },
                { name: '**/rolelist**', value: 'ロール一覧', inline: true },
                { name: '**/serverinfo**', value: 'サーバー情報の表示', inline: true },
                { name: '**/shorturl**', value: 'URLの短縮', inline: true }
            )
            .setColor(0xf8b4cb);

        const embed6 = new EmbedBuilder()
            .setColor(0xee99ff)
            .setTitle("えむbot｜help")
            .setDescription('コマンド一覧 (5)')
            .setFooter({ text:'Emubot | help', iconURL:'https://royalblossom.nl/img/878735.jpg' })
            .addFields(
                { name: '**/userinfo**', value: 'ユーザー情報の表示', inline: true },
                { name: '**/kongyo**', value: 'コンギョを送信', inline: true },
                { name: '**/changenumber**', value: '進数変換', inline: true },
                { name: '**/ip search**', value: 'IPアドレス検索', inline: true },
                { name: '**/whois**', value: 'whois検索', inline: true },
                { name: '**/yahoonews**', value: 'yahooニュースの取得', inline: true }
            )
            .setColor(0xf8b4cb);

        const embed7 = new EmbedBuilder()
            .setColor(0xee99ff)
            .setTitle("えむbot｜help")
            .setDescription('コマンド一覧 (6)')
            .setFooter({ text:'Emubot | help', iconURL:'https://royalblossom.nl/img/878735.jpg' })
            .addFields(
                { name: '**/random**', value: 'ランダムな英数字生成', inline: true },
                { name: '**/google**', value: 'Google検索を行います', inline: true },
                { name: '**/serverlist**', value: '参加サーバーリストを表示', inline: true },
                { name: '**/timer**', value: 'タイマーを設置', inline: true },
                { name: '**/link-to-image**', value: '画像をリンクに変換します', inline: true },
                { name: '**/banount**', value: 'BAN数を表示', inline: true }
            )
            .setColor(0xf8b4cb);

        const embed8 = new EmbedBuilder()
            .setColor(0xee99ff)
            .setTitle("えむbot｜help")
            .setDescription('コマンド一覧 (7)')
            .setFooter({ text:'Emubot | help', iconURL:'https://royalblossom.nl/img/878735.jpg' })
            .addFields(
                { name: '**/mcserver**', value: 'マイクラのサーバーステータスと表示', inline: true },
                { name: '**/rate**', value: 'USD / JPY', inline: true },
                { name: '**/spoofing**', value: 'なりすまし', inline: true },
                { name: '**/dot**', value: 'ドット絵変換', inline: true },
                { name: '**/urlchecker**', value: 'URLの危険性を判定', inline: true }
            )
            .setColor(0xf8b4cb);
        
        const pages = [embed1, embed2, embed3, embed4, embed5, embed6, embed7, embed8];
        await buttonPages(interaction, pages);
    },
};
