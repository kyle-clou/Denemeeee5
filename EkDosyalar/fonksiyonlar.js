function miafYeniSira(miafrray, key= "ve") {
    var buyukluk = miafrray.length;
    return `${miafrray.slice(0, -1).join(', ')}${buyukluk> 1 ? `${buyukluk> 2 ? ',' : ''} ${key} ` : ''}${miafrray.slice(-1)}`;
    }
    //["XD", "asD", "1"] çıktı => XD, asD ve 1



/*
exports.NonDigits = /\D/g;

exports.UserMention = /<@!?(\d{17,20})>/;
exports.UserMentionAndId = /(\d{17,20})|<@!?(\d{17,20})>/;
exports.RoleMention = /<@&(\d+)>/;
exports.ChannelMention = /<#(\d+)>/;
exports.EveryoneHereMention = /@everyone|@here/;
exports.Emoji = /(\p{ExtPict}(?:\p{EComp}(?:\p{ExtPict}|\p{EMod}|\p{EBase}))*\p{EComp}?|\d\u{FE0F}\u{20E3}|[\u{1F1E6}-\u{1F1FF}][\u{1F1E6}-\u{1F1FF}]?)/u; 

exports.CustomEmote = /<(?:a)?:([a-zA-Z0-9_]{2,32}):(\d{17,})>/; 
exports.GetEverythingAfterColon = /(?<=\:)[^:]*$/;
exports.ReasonImage = /((?:https?:\/\/)[a-z0-9]+(?:[-.][a-z0-9]+)*\.[a-z]{2,5}(?::[0-9]{1,5})?(?:\/[^ \n<>]*)\.(?:png|apng|jpg|gif))/;
exports.QuoteMarked = /"(.*?)"/;

exports.AutoMod_INVITE = /(?:https?:\/\/)?(?:www\.)?discord(?:\.gg|\.me|(?:app)?\.com\/invite)\/([A-Za-z0-9-]+)/;
exports.AutoMod_WEBSITE = /(?:https?:\/\/)?((?:[A-Za-z0-9]+\.){1,128}(?:[A-Za-z0-9]{2,63}))(\/[A-Za-z0-9._~:/?#\[\]@!$&'()*+,;%=-]*)?/;

exports.makeGlobal = (regex) => new RegExp(regex, 'g');


*/