const moment = require('moment');

module.exports = {
    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
            let newStr = str + " ";
            newStr = str.substr(0, len);
            newStr = str.substr(0, newStr.lastIndexOf(" "));
            newStr = (newStr.length > 0) ? newStr : str.substr(0, len);
            return newStr + '...';
        }
        return str;
    },
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '');
    },
    formatDate: function (date, format) {
        return moment(date).format(format);
    },
    select: function (selected, options) {
        return options.fn(this)
            .replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"')
            .replace(new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
    },

    editIcon: function (storyUser, loggedUser, storyId, floating = true) {
        if (storyUser === loggedUser) {
            if (floating) {
                return `<a href="/stories/edit/${storyId}" class="btn btn-outline-warning"><i class="far fa-edit"></i></a>`;
            } else {
                return `<a href="/stories/edit/${storyId}"><i class="far fa-edit"></i></a>`;
            }
        } else {
            return '';
        }
    }

};