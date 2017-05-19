;(function (win, doc) {
  var _xhr;
  var _xml_doc;
  var _parser;
  var _url = 'https://robomonkey.org/extern.php?action=feed&type=atom';

  if (!('DOMParser' in win)) {
    return;
  }

  _parser = new win.DOMParser();

  if ('fetch' in win) {

    win.fetch(_url, {
      "mode": "no-cors"
    }).then(function (resp) {
      if (resp.ok) {
        return resp.text().then(function (xml) {
          _xml_doc = _parser.parseFromString(xml, 'text/xml');
          if (typeof _xml_doc !== 'undefined') {
            populateFeed(_xml_doc);
          }
        });
      }
    });

  } else if ('XMLHttpRequest' in win) {

    _xhr = new win.XMLHttpRequest();
    _xhr.open('GET', _url, true);
    if ('responseType' in _xhr) {
      _xhr.responseType = 'text';
    }
    _xhr.onreadystatechange = function () {
      if (_xhr.readyState === 4 && _xhr.status >= 200 && _xhr.status < 300) {
        _xml_doc = _parser.parseFromString(_xhr.responseText, 'text/xml');

        if (typeof _xml_doc !== 'undefined') {
          populateFeed(_xml_doc);
        }
      }
    };
    _xhr.ontimeout = _xhr.onerror = _xhr.onabort = function () {
      _xhr.onreadystatechange = _xhr.ontimeout = _xhr.onerror = _xhr.onabort = function () {};
    };
    _xhr.send(null);
  }

  function populateFeed (xml_doc) {
    var _entries = xml_doc.getElementsByTagName('entry');
    var _now = new win.Date().getTime();
    var i = _entries.length;
    var idx1 = doc.getElementById('idx1');
    var idx0;
    var _friendly_date;

    idx1.insertAdjacentHTML('beforeBegin', '<div id="idx0" class="blocktable"> \
      <h2> \
        <span>Latest Posts</span></h2> \
        <div class="box"> \
          <div class="inbox"> \
            <table> \
              <thead> \
                <tr> \
                  <th class="tcl" scope="col">Thread</th> \
                  <th class="tc2 scope="col"></th> \
                  <th class="tcr" scope="col">Last Post</th> \
                </tr> \
              </thead> \
              <tbody> \
              </tbody> \
            </table> \
          </div> \
        </div> \
      </div>');

    idx0 = doc.getElementById('idx0');
    doc.getElementById('brdmain').insertBefore(idx0, idx1);

    while (i--) {
      _friendly_date = getFriendlyDate(_now, _entries[i].getElementsByTagName('updated')[0].textContent);

      idx0.querySelector('table > tbody').insertAdjacentHTML('afterBegin', '<tr> \
        <td class="tcl"> \
          <div class="icon icon-new"> \
            <div class="nosize">' + (i + 1) + '</div> \
          </div> \
          <div class="tclcon"> \
            <div> \
              <h3> \
                <a href="' + _entries[i].getElementsByTagName('id')[0].textContent + '">' +
                  _entries[i].getElementsByTagName('title')[0].textContent +
                '</a> \
              </h3> \
            </div> \
          </div> \
        </td> \
        <td class="tc2"></td> \
        <td class="tcr"> \
          <a href="' + _entries[i].getElementsByTagName('id')[0].textContent + '">' +
            _friendly_date +
          ' ago</a> \
          <span class="byuser">by ' +
            _entries[i].getElementsByTagName('author')[0].getElementsByTagName('name')[0].textContent +
          '</span> \
        </td> \
      </tr>');
    }

  }

  function getFriendlyDate (now, updated) {
    var _seconds = ((now - (new win.Date(updated).getTime())) / 1000) << 0;
    var _temp;
    if (_seconds > 31449599) {
      _temp = (_seconds / 60 / 60 / 24 / 7 / 52 << 0);
      return _temp + ' year' + (_temp <= 1 ? '' : 's');
      
    } else if (_seconds > 604799) {
      _temp = (_seconds / 60 / 60 / 24 / 7 << 0);
      return _temp + ' week' + (_temp <= 1 ? '' : 's');
      
    } else if (_seconds > 86399) {
      _temp = (_seconds / 60 / 60 / 24 << 0);
      return _temp + ' day' + (_temp <= 1 ? '' : 's'); 
   
    } else if (_seconds > 3599) {
      _temp = (_seconds / 60 / 60 << 0);
      return  _temp + ' hour' + (_temp <= 1 ? '' : 's');

    } else if (_seconds < 3600 && _seconds > 59) {
      _temp = (_seconds / 60 << 0);
      return _temp + ' minute' + (_temp <= 1 ? '' : 's');

    } else if (_seconds < 60) {
      return _seconds + ' second' + (_seconds <= 1 ? '' : 's');
    }
  }

})(window, window.document);
