/*
 This file is part of AXE Ninja.
 https://github.com/axerunners/axeninja-fe

 AXE Ninja is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 AXE Ninja is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with AXE Ninja.  If not, see <http://www.gnu.org/licenses/>.

 */

// AXE Ninja Front-End (axeninja-fe) - Masternode Detail
// By elberethzone / https://dashtalk.org/members/axerunners.175/

var axeninjaversion = '3.3.0';
var tablePayments = null;
var tableExStatus = null;
var dataProtocolDesc = [];
var maxProtocol = -1;
var axemainkeyregexp = /^[7X][a-zA-Z0-9]{33}$/;
var axetestkeyregexp = /^[yx][a-zA-Z0-9]{33}$/;
var axeoutputregexp = /^[a-z0-9]{64}-[0-9]+$/;
var mnpubkey = '';
var mnvin = '';

$.fn.dataTable.ext.errMode = 'throw';

var axeninjatestnet = 0;

if (typeof axeninjatestnethost !== 'undefined') {
    if (window.location.hostname == axeninjatestnethost) {
        axeninjatestnet = 1;
    }
}
if (typeof axeninjatestnettor !== 'undefined') {
    if (window.location.hostname == axeninjatestnettor) {
        axeninjatestnet = 1;
    }
}
if (typeof axeninjatestneti2p !== 'undefined') {
    if (window.location.hostname == axeninjatestneti2p) {
        axeninjatestnet = 1;
    }
}

if (typeof axeninjacoin === 'undefined') {
  var axeninjacoin = ['',''];
}
if (typeof axeninjaaddressexplorer === 'undefined') {
  var axeninjaaddressexplorer = [[],[]];
}
if (typeof axeninjaaddressexplorer[0] === 'undefined') {
  axeninjaaddressexplorer[0] = [];
}
if (typeof axeninjaaddressexplorer[1] === 'undefined') {
  axeninjaaddressexplorer[1] = [];
}

function tablePaymentsRefresh(){
  tablePayments.api().ajax.reload();
  // Set it to refresh in 60sec
  setTimeout(tablePaymentsRefresh, 150000);
};

function mndetailsRefresh(useVin){
  console.log("DEBUG: mndetailsRefresh starting");
  $('#mninfosLR').html( '<i class="fa fa-spinner fa-pulse"></i> Refreshing <i class="fa fa-spinner fa-pulse"></i>' );
  var query = '/api/masternodes?balance=1&portcheck=1&lastpaid=1&exstatus=1&testnet='+axeninjatestnet;
  if (useVin) {
    query += '&vins=["'+mnvin+'"]';
  }
  else {
    query += '&pubkeys=["'+mnpubkey+'"]';
  }
    console.log("DEBUG: REST query="+query);
  $.getJSON( query, function( data ) {
   var date = new Date();
   var n = date.toDateString();
   var time = date.toLocaleTimeString();
   var result = "";

   console.log("DEBUG: REST api query responded!");

   if ((!data.hasOwnProperty("data")) || (data.data.length < 1)) {
    result = 'Unknown masternode';
    $('#mnoutput').text(result+" ("+mnvin+")");
    $('#mnpubkey').text(result+" ("+mnpubkey+")");      
    $('#mnipport').text(result);      
    $('#mncountry').text(result);
    $('#mnstatus').text(result).removeClass("danger").removeClass("warning").removeClass("success");
    $('#mnstatuspanel').removeClass("panel-primary").removeClass("panel-yellow").removeClass("panel-green").removeClass("panel-red").addClass("panel-primary");
    $('#mnsentinelpanel').removeClass("panel-primary").removeClass("panel-green").removeClass("panel-red").addClass("panel-primary");
    $('#mnsentinelcheck').text('???');
    $('#mnlistsentinelversion').text(result);
    $('#mnlistdaemonversion').text(result);
    $('#mnactiveduration').text(result);
    $('#mnlastseen').text(result);
    $('#mnbalance').text(result).removeClass("danger").removeClass("success");
    $('#mnlastpaid').text(result);
    $('#mnportcheck').text(result).removeClass("danger").removeClass("info").removeClass("success");
    $('#mnportchecknext').text(result);
    $('#mnversion').text(result);
   }
   else {

    $('#mnoutput').text( data.data[0].MasternodeOutputHash+"-"+data.data[0].MasternodeOutputIndex );
    $('#mnpubkey').text( data.data[0].MasternodePubkey );
       var mnip = "";
       if ( data.data[0].MasternodeIP == "::" ) {
           mnip = data.data[0].MasternodeTor+".onion";
       }
       else {
           mnip = data.data[0].MasternodeIP;
       }
    $('#mnipport').text( mnip+":"+data.data[0].MasternodePort );
    mnpubkey = data.data[0].MasternodePubkey;

    var activecount = parseInt(data.data[0].ActiveCount);
    var inactivecount = parseInt(data.data[0].InactiveCount);
    var unlistedcount = parseInt(data.data[0].UnlistedCount);
    var total = activecount+inactivecount+unlistedcount;
    var ratio = activecount / total;
    result = ratio;
    var cls = "";
    if ( ratio == 1 ) {
      result = 'Active';
      cls = "panel-green";
    } else if ( ratio == 0 ) {
      result = 'Inactive';
      cls = "panel-red";
    } else if ( unlistedcount > 0 ) {
      result = 'Partially Unlisted';
      cls = "panel-yellow";
    } else {
      result = 'Partially Inactive';
      cls = "panel-yellow";
    }
    result += ' ('+Math.round(ratio*100)+'%)';
    $('#mnstatus').text(result);
    $('#mnstatuspanel').removeClass("panel-primary").removeClass("panel-yellow").removeClass("panel-green").removeClass("panel-red").addClass(cls);
    if (data.data[0].MasternodeActiveSeconds < 0) {
      result = 'Inactive';
    }
    else {
      result = diffHRlong(data.data[0].MasternodeActiveSeconds);
    }
    $('#mnactiveduration').text ( result);
    if (data.data[0].MasternodeLastSeen > 0) {
        var tmpDate = new Date(data.data[0].MasternodeLastSeen*1000);
        result = tmpDate.toLocaleString()+" ("+deltaTimeStampHRlong(data.data[0].MasternodeLastSeen,currenttimestamp())+" ago)";
    }
    else {
      result = 'Just now ('+data.data[0].MasternodeLastSeen+')';
    }
    $('#mnlastseen').text ( result);

    var cls = "panel-green";
    if (data.data[0].MasternodeSentinelState != 'current') {
      cls = "panel-red";
    }
    $('#mnsentinelcheck').text(data.data[0].MasternodeSentinelState);
    $('#mnsentinelpanel').removeClass("panel-primary").removeClass("panel-green").removeClass("panel-red").addClass(cls);
    $('#mnlistsentinelversion').text(data.data[0].MasternodeSentinelVersion);
    $('#mnlistdaemonversion').text(data.data[0].MasternodeDaemonVersion);

    // Balance data
    var num = Math.round( data.data[0].Balance.Value * 1000 ) / 1000;
    if ( num < 1000 ) {
      cls = "danger";
    } else {
      cls = "success";
    }
    $('#mnbalance').text ( addCommas( num.toFixed(3) )+' '+axeninjacoin[axeninjatestnet]).removeClass("danger").removeClass("success").addClass(cls);

    // Last Paid data
    var outtxt = "";
    if (data.data[0].MasternodeLastPaid != 0) {
        var tmpDate = new Date(data.data[0].MasternodeLastPaid*1000);
      outtxt = tmpDate.toLocaleString()+" ("+deltaTimeStampHRlong(parseInt(data.data[0].MasternodeLastPaid),currenttimestamp())+" ago)";
    }
    else {
      outtxt = 'Never/Unknown';
    }
    $('#mnlastpaid').html( outtxt );

    // Last Paid from blocks data
    var outtxt = "";
    if (data.data[0].LastPaidFromBlocks !== false) {
      var tmpDate = new Date(data.data[0].LastPaidFromBlocks.MNLastPaidTime*1000);
      outtxt = tmpDate.toLocaleString()+" ("+deltaTimeStampHRlong(parseInt(data.data[0].LastPaidFromBlocks.MNLastPaidTime),currenttimestamp())+" ago) on block ";
      if (axeninjaqueryexplorer[axeninjatestnet].length > 0) {
        outtxt += '<a href="'+axeninjaqueryexplorer[axeninjatestnet][0][0].replace('%%q%%',data.data[0].LastPaidFromBlocks.MNLastPaidBlock)+'">'+data.data[0].LastPaidFromBlocks.MNLastPaidBlock+'</a>';
      }
      else {
        outtxt += data.data[0].LastPaidFromBlocks.MNLastPaidBlock;
      }
    }
    else {
      outtxt = 'Never/Unknown';
    }
    $('#mnlastpaidfromblocks').html( outtxt );

    cls = "danger";
    if (Math.abs(parseInt(data.data[0].MasternodeLastPaid)-parseInt(data.data[0].LastPaidFromBlocks.MNLastPaidTime)) < 120) {
      cls = "success";
    }
    $('#mnlastpaid').removeClass("success").removeClass("danger").addClass(cls);
    $('#mnlastpaidfromblocks').removeClass("success").removeClass("danger").addClass(cls);

    // Port Check data
    $('#mncountry').html( '<img src="/static/flags/flags_iso/16/'+data.data[0].Portcheck.CountryCode+'.png" width=16 height=16 /> '+data.data[0].Portcheck.Country );
    var txt = data.data[0].Portcheck.Result;
    cls = "";
    if ((data.data[0].Portcheck.Result == 'closed') || (data.data[0].Portcheck.Result == 'timeout')) {
      txt = "Closed ("+data.data[0].Portcheck.ErrorMessage+")";
      cls = "panel-red";
    } else if (data.data[0].Portcheck.Result == 'unknown') {
      txt = "Pending";
      cls = "panel-primary";
    } else if ((data.data[0].Portcheck.Result == 'open') || (data.data[0].Portcheck.Result == 'rogue')) {
      txt = "Open";
      cls = "panel-green";
    }
    $('#mnportcheck').text(txt);
    $('#mnportcheckpanel').removeClass("panel-red").removeClass("panel-primary").removeClass("panel-green").addClass(cls);
    if (data.data[0].Portcheck.NextCheck < currenttimestamp()) {
      if (txt != "Pending") {
        $('#mnportchecknext').text('Re-check pending');
      }
    }
    else {
      $('#mnportchecknext').text(deltaTimeStampHRlong(data.data[0].Portcheck.NextCheck,currenttimestamp()));
    }
    var date = new Date(data.data[0].Portcheck.NextCheck*1000);
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
       $('#mnportchecknextdate').text(n+' '+time);

       var versioninfo = '<i>Unknown</i>';
    if ((data.data[0].hasOwnProperty("Portcheck")) && (data.data[0].Portcheck != false)) {
        if ((data.data[0].Portcheck.SubVer.length > 10) && (data.data[0].Portcheck.SubVer.substring(0, 9) == '/Satoshi:') && (data.data[0].Portcheck.SubVer.substring(data.data[0].Portcheck.SubVer.length - 1) == '/')) {
            versioninfo = data.data[0].Portcheck.SubVer.substring(9, data.data[0].Portcheck.SubVer.indexOf('/', 10));
        }
        else if ((data.data[0].Portcheck.SubVer.length > 7) && (data.data[0].Portcheck.SubVer.substring(0, 6) == '/Core:') && (data.data[0].Portcheck.SubVer.substring(data.data[0].Portcheck.SubVer.length - 1) == '/')) {
            versioninfo = data.data[0].Portcheck.SubVer.substring(6, data.data[0].Portcheck.SubVer.indexOf('/', 6));
        }
        else if ((data.data[0].Portcheck.SubVer.length > 11) && (data.data[0].Portcheck.SubVer.substring(0, 11) == '/Axe Core:') && (data.data[0].Portcheck.SubVer.substring(data.data[0].Portcheck.SubVer.length - 1) == '/')) {
            versioninfo = data.data[0].Portcheck.SubVer.substring(11, data.data[0].Portcheck.SubVer.indexOf('/', 11));
        }
    }
    else {
        versioninfo = "Unknown";
    }
    $('#mnversion').html( versioninfo+" (Protocol="+data.data[0].MasternodeProtocol+")" );
       $('#mnversionraw').html( data.data[0].Portcheck.SubVer );
       $('#mnportcheckerror').html( data.data[0].Portcheck.ErrorMessage );
   }
   $('#mninfosLR').text( n + ' ' + time );

      tablePayments = $('#paymentstable').dataTable( {
        responsive: true,
        searching: false,
        ajax: { url: '/api/blocks?testnet='+axeninjatestnet+'&pubkeys=["'+data.data[0].MasternodePubkey+'"]&interval=P1M',
                dataSrc: 'data.blocks',
                cache: true },
        paging: false,
        order: [[ 0, "desc" ]],
        columns: [
            { data: null, render: function ( data, type, row ) {
              if (type == 'sort') {
                return data.BlockTime;
              }
              else {
                var date = new Date(data.BlockTime*1000);
                var day = "0"+date.getDate();
                var month = "0"+(date.getMonth()+1);
                var year = date.getFullYear();
                var hours = "0"+date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                var formattedTime = hours.substr(hours.length-2) + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);
                return date.getFullYear()+"-"+month.substr(month.length-2)+"-"+day.substr(day.length-2)+" "+formattedTime;
              }

            } },
            { data: null, render: function ( data, type, row ) {
               var outtxt = data.BlockId;
               if (type != 'sort') {
                 if (axeninjablockexplorer[axeninjatestnet].length > 0) {
                   outtxt = '<a href="'+axeninjablockexplorer[axeninjatestnet][0][0].replace('%%b%%',data.BlockHash)+'">'+data.BlockId+'</a>';
                 }
               }
               return outtxt;
            } },
            { data: null, render: function ( data, type, row ) {
               var outtxt = data.BlockPoolPubKey;
               if (data.PoolDescription) {
                 outtxt = data.PoolDescription;
               }
               return outtxt;
            } },
            { data: "BlockMNValue" },
            { data: null, render: function ( data, type, row ) {
               return (Math.round(data.BlockMNValueRatioExpected*1000)/10).toFixed(1)+"%/"+(Math.round(data.BlockMNValueRatio*1000)/10).toFixed(1)+"%";
            } },
            { data: null, render: function ( data, type, row ) {
               if ((type != "sort") && (data.BlockMNPayeeExpected == "")) {
                 return "<i>Unknown</i>";
               } else if (type == "sort") {
                 return data.BlockMNPayeeExpected;
               } else {
                 return '<a href="'+axeninjamasternodemonitoring[axeninjatestnet].replace('%%p%%',data.BlockMNPayeeExpected)+'">'+data.BlockMNPayeeExpected+'</a>';;
               }
            } },
            { data: null, render: function ( data, type, row ) {
               if ((type != "sort") && (data.BlockMNPayee == "")) {
                 return "<i>Unpaid block</i>";
               } else if (type == "sort") {
                 return data.BlockMNPayee;
               } else {
                 return '<a href="'+axeninjamasternodemonitoring[axeninjatestnet].replace('%%p%%',data.BlockMNPayee)+'">'+data.BlockMNPayee+'</a>';;
               }
            } }
        ],
        createdRow: function ( row, data, index ) {
          if (data.BlockMNPayeeExpected == mnpubkey) {
            $('td',row).eq(5).removeClass("danger").removeClass("success").addClass("success");
          }
          else {
            $('td',row).eq(5).removeClass("danger").removeClass("success").addClass("danger");
          }
          if (data.BlockMNPayee == mnpubkey) {
            $('td',row).eq(6).removeClass("danger").removeClass("success").addClass("success");
          }
          else {
              $('td',row).eq(6).removeClass("danger").removeClass("success").addClass("danger");
          }
        }
   } );
      tableExStatus = $('#exstatustable').dataTable( {
          responsive: true,
          searching: false,
          data: data.data[0].ExStatus,
          paging: false,
          order: [[ 0, "asc" ]],
          columns: [
              { data: "NodeName" },
              { data: null, render: function ( data, type, row ) {
                      var outtxt = '';
                      if (type != "sort") {
                          if (data.StatusEx == "ENABLED") {
                              outtxt = '<i class="fa fa-thumbs-up"> ';
                          } else if (data.StatusEx == "PRE_ENABLED") {
                              outtxt = '<i class="fa fa-thumbs-o-up"> ';
                          } else if (data.StatusEx == "WATCHDOG_EXPIRED") {
                              outtxt = '<i class="fa fa-cogs"> ';
                          } else if (data.StatusEx == "POS_ERROR") {
                              outtxt = '<i class="fa fa-exclamation-triangle"> ';
                          } else if (data.StatusEx == "REMOVE") {
                              outtxt = '<i class="fa fa-chain-broken"> ';
                          } else if (data.StatusEx == "EXPIRED") {
                              outtxt = '<i class="fa fa-clock-o"> ';
                          } else if (data.StatusEx == "VIN_SPENT") {
                              outtxt = '<i class="fa fa-money"> ';
                          } else if (data.StatusEx == "NEW_START_REQUIRED") {
                              outtxt = '<i class="fa fa-wrench"> ';
                          } else if (data.StatusEx == "UPDATE_REQUIRED") {
                              outtxt = '<i class="fa fa-wrench"> ';
                          } else if (data.StatusEx != '') {
                              outtxt = '<i class="fa fa-thumbs-down"> ';
                          }
                      }
                      outtxt = outtxt+data.StatusEx;
                      return outtxt; } },
              { data: null, render: function ( data, type, row ) {
                      if (type == "sort") {
                          return data.Status;
                      } else if (data.Status == "active") {
                          return '<i class="fa fa-play"> Active';
                      } else if (data.Status == "inactive") {
                          return '<i class="fa fa-pause"> Inactive';
                      } else if (data.Status == "unlisted") {
                          return '<i class="fa fa-stop"> Unlisted';
                      }
                  } },
              { data: "NodeVersion" },
              { data: "NodeProtocol" }
          ],
          createdRow: function ( row, data, index ) {
              if (data.Status == "active") {
                  $('td',row).eq(2).css({"background-color": "#dff0d8", "color": "#3c763d"});
              }
              else if (data.Status == "inactive") {
                  $('td',row).eq(2).css({"background-color": "#fcf8e3", "color": "#8a6d3b"});
              }
              else {
                  $('td',row).eq(2).css({"background-color": "#f2dede", "color": "#a94442"});
              }
              if (data.StatusEx == "ENABLED") {
                  $('td',row).eq(1).css({"background-color": "#dff0d8", "color": "#3c763d"});
              }
              else if (data.StatusEx == "PRE_ENABLED") {
                  $('td',row).eq(1).css({"background-color": "#fcf8e3", "color": "#8a6d3b"});
              }
              else {
                  $('td',row).eq(1).css({"background-color": "#f2dede", "color": "#a94442"});
              }
          }
      } );
      $('#exstatustableLR').text( n + ' ' + time );
   console.log("DEBUG: auto-refresh starting");
   setTimeout(mndetailsRefresh, 300000);
  });
};

$(document).ready(function(){

  $('#axeninjajsversion').text( axeninjaversion ).addClass("label-info").removeClass("label-danger");

  if (axeninjatestnet == 1) {
    $('#testnetalert').show();
    $('#testnettitle').show();
    $('a[name=menuitemexplorer]').attr("href", "https://"+axeninjatestnetexplorer);
  }

  mnpubkey = getParameter("mnpubkey");
  console.log("DEBUG: mnpubkey="+mnpubkey);
  mnvin = getParameter("mnoutput");
  console.log("DEBUG: mnvin="+mnvin);

  if ((mnpubkey == "") && (mnvin == "")) {
    mnpubkey = 'Need "mnpubkey" parameter';
    $('#mnpubkey').text(mnpubkey);
    mnvin = 'Need "mnoutput" parameter';
    $('#mnvin').text(mnvin);
  }
  else {
    if ((mnpubkey != "") && (mnvin == "")) {
      if (((axeninjatestnet == 0) && (!axemainkeyregexp.test(mnpubkey)))
        || ((axeninjatestnet == 1) && (!axetestkeyregexp.test(mnpubkey)))) {
        mnpubkey = 'Invalid';
        $('#mnpubkey').text(mnpubkey);
      }
      else {
        mndetailsRefresh(false);
      }
    }
    else {
      if (!axeoutputregexp.test(mnvin)) {
        mnvin = 'Invalid';
        $('#mnoutput').text( mnvin );
      }
      else {
        mndetailsRefresh(true);
      }
    }
  }

  $('#paymentstable').on('xhr.dt', function ( e, settings, json ) {
        // Fill per version stats table
        var totpaid = 0.0;
        var numpaid = 0;
        var missed = 0;
        var hijacked = 0;
        for (var block in json.data.blocks) {
          if(json.data.blocks[block].BlockMNPayee == mnpubkey) {
            totpaid += parseFloat(json.data.blocks[block].BlockMNValue);
            numpaid ++;
            if (json.data.blocks[block].BlockMNPayee != json.data.blocks[block].BlockMNPayeeExpected) {
              hijacked++;
            }
          }
          else {
            if (json.data.blocks[block].BlockMNPayee != json.data.blocks[block].BlockMNPayeeExpected) {
              missed++;
            }
          }
        }
        var num = Math.round( totpaid * 1000 ) / 1000;
        $('#mntotalpaid').text ( addCommas( num.toFixed(3) )+' '+axeninjacoin[axeninjatestnet]+' ('+numpaid+' times / '+missed+' missed / '+hijacked+' hijacked)');

        // Change the last refresh date
        var date = new Date();
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#paymentstableLR').text( n + ' ' + time );
      } );

});
