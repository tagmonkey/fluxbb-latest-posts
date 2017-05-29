;(function (win, doc) {
  var _url = 'https://robomonkey.org/extern.php?action=feed&type=atom';
  var _xhr, _xml_doc, _parser;

  if (!('DOMParser' in win) || !('XMLHttpRequest' in win)) { return; }
  (doc.head || doc.getElementsByTagName('head')[0]).insertAdjacentHTML('beforeend',win.decodeURIComponent('%3Cstyle%20type%3D%22text%2Fcss%22%3E%23brdmain%7Bposition%3Arelative%3Bpadding-top%3A'+(doc.getElementById('idx1').clientHeight + 12)+'px%7D%23idx0%2C%23idx1%7Bposition%3Aabsolute%3Btop%3A0%3Bleft%3A0%3Bright%3A0%7D%23idx0%2C%23idx1%7B-webkit-pointer-events%3Anone%3Bpointer-events%3Anone%7D%23idx0%3E.box%7Bheight%3A'+(doc.querySelector('#idx1>.box').clientHeight + 6)+'px%3Boverflow%3Aauto%3B-webkit-overflow-scrolling%3Atouch%7D%23idx0%3Eh2%2C%23idx1%3Eh2%2C%23idx0%3E.box%2C%23idx1%3E.box%7B-webkit-pointer-events%3Aauto%3Bpointer-events%3Aauto%7D%23idx0%3Eh2%2C%23idx1%3Eh2%7Bopacity%3A.7%3Btransition%3A.2s%20cubic-bezier(.4%2C0%2C.2%2C1)%20opacity%7D%23idx0%3Eh2%7Bposition%3Arelative%3Bleft%3A124px%7D%23idx0.active%3Eh2%2C%23idx1.active%3Eh2%7Bopacity%3A1%3Btransition%3A.2s%20cubic-bezier(.4%2C0%2C.2%2C1)%20opacity%7D%23idx0%3E.box%2C%23idx1%3E.box%7Bdisplay%3Anone%7D%23idx0.active%3E.box%2C%23idx1.active%3E.box%7Bdisplay%3Ablock%7D%3C%2Fstyle%3E'));
  _parser = new win.DOMParser();
  _xhr = new win.XMLHttpRequest();
  _xhr.open('GET', _url, true);
  
  if ('responseType' in _xhr) { _xhr.responseType = 'text'; }
  
  _xhr.onreadystatechange = function () {
    if (_xhr.readyState > 3 && _xhr.status >= 200 && _xhr.status < 300) {
      _xml_doc = _parser.parseFromString(_xhr.responseText, 'text/xml');
      if (typeof _xml_doc !== 'undefined') { populateFeed(_xml_doc); }
    }
  };
  _xhr.ontimeout = _xhr.onerror = _xhr.onabort = function (e) {
    win.console.log('[Error fetching feed]', e);
    _xhr.onreadystatechange = _xhr.ontimeout = _xhr.onerror = _xhr.onabort = function () {};
  };
  _xhr.send(null);

  function populateFeed (xml_doc) {
    var _entries = xml_doc.getElementsByTagName('entry');
    var _now = new win.Date().getTime();
    var _i = _entries.length;
    var _idx1 = doc.getElementById('idx1');
    var _idx0;
    var _friendly_date;

    _idx1.insertAdjacentHTML('beforeBegin', '<div id="idx0" class="blocktable"> \
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

    _idx0 = doc.getElementById('idx0');
    doc.getElementById('brdmain').insertBefore(_idx0, _idx1);

    while (_i--) {
      _friendly_date = getFriendlyDate(_now, _entries[_i].getElementsByTagName('updated')[0].textContent);

      _idx0.querySelector('table > tbody').insertAdjacentHTML('afterBegin', '<tr> \
        <td class="tcl"> \
          <div class="icon icon-new"> \
            <div class="nosize">' + (_i + 1) + '</div> \
          </div> \
          <div class="tclcon"> \
            <div> \
              <h3> \
                <a href="' + _entries[_i].getElementsByTagName('id')[0].textContent + '">' +
                  _entries[_i].getElementsByTagName('title')[0].textContent +
                '</a> \
              </h3> \
              <div class="forumdesc">' +
                '\u2026' +
              '</div> \
            </div> \
          </div> \
        </td> \
        <td class="tc2"></td> \
        <td class="tcr"> \
          <a href="' + _entries[_i].getElementsByTagName('id')[0].textContent + '">' +
            _friendly_date +
          ' ago</a> \
          <span class="byuser">by ' +
            _entries[_i].getElementsByTagName('author')[0].getElementsByTagName('name')[0].textContent +
          '</span> \
        </td> \
      </tr>');
    }
    if ('ontouchstart' in win) {
      win.addEventListener('touchstart', dispatch, false);
    } else {
      win.addEventListener('click', dispatch, false);
    }
  }
  
  function dispatch (e) {
    var _idx0, _idx1, _evt, _evtp;
    if (typeof e === 'undefined' || typeof e.target === 'undefined' || e.target.nodeType !== 1) { return; }
    _idx0 = doc.getElementById('idx0');
    _idx1 = doc.getElementById('idx1');
    _evt = e.target;
    switch (_evt.tagName.toLowerCase()) {
      case 'h2':
        _evtp = _evt.parentNode;
        switch (_evtp.id) {
          case 'idx0':
            _idx0.classList.add('active');
            _idx1.classList.remove('active');
            break;
          case 'idx1':
            _idx0.classList.remove('active');
            _idx1.classList.add('active');
            break;
        }
        break;
      case 'span':
        _evtp = _evt.parentNode.parentNode;
        switch (_evtp.id) {
          case 'idx0':
            _idx0.classList.add('active');
            _idx1.classList.remove('active');
            break;
          case 'idx1':
            _idx0.classList.remove('active');
            _idx1.classList.add('active');
            break;
        }
        break;
    }
  }
  
  function sanitize (text) {
    return text.split('').map(function (char) {
      return char === '<' ? '&lt;' : char === '>' ? '&gt;' : char
    ;}).join('');
  }

  function getFriendlyDate (now, updated) {
    var _seconds = ((now - (new win.Date(updated).getTime())) / 1000) << 0;
    var _temp;
    
    switch (true) {
      case !!(_seconds > 31449599):
        _temp = (_seconds / 60 / 60 / 24 / 7 / 52 << 0);
        return _temp + ' year' + (_temp <= 1 ? '' : 's');
        
      case !!(_seconds > 604799):
        _temp = (_seconds / 60 / 60 / 24 / 7 << 0);
        return _temp + ' week' + (_temp <= 1 ? '' : 's');
        
      case !!(_seconds > 86399):
        _temp = (_seconds / 60 / 60 / 24 << 0);
        return _temp + ' day' + (_temp <= 1 ? '' : 's'); 
        
      case !!(_seconds > 3599):
        _temp = (_seconds / 60 / 60 << 0);
        return  _temp + ' hour' + (_temp <= 1 ? '' : 's');
        
      case !!(_seconds < 3600 && _seconds > 59):
        _temp = (_seconds / 60 << 0);
        return _temp + ' minute' + (_temp <= 1 ? '' : 's');
        
      default:
        return _seconds + ' second' + (_seconds <= 1 ? '' : 's');
    }
  }

})(window, window.document);
