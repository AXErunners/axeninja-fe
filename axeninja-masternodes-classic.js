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

// AXE Ninja Front-End (axeninja-fe) - Masternode List Classic (v2)
// By elberethzone / https://www.axe.org/forum/members/elbereth.175/

var axeninjaversion = '1.0.1';
var tableLocalNodes = null;
var tableBlockConsensus = null;
var tableMNList = null;
var chartMNVersions = null;
var axeversiondefault = "0.12.3.0";
var axeversion = axeversiondefault;
var axeversioncheck = axeversion;
var axeversionsemaphore = false;
var sentinelversiondefault = "1.1.0";
var sentinelversion = sentinelversiondefault;
var axemaxprotocol = 0;

$.fn.dataTable.ext.errMode = 'throw';

if(typeof(Storage) !== "undefined") {
    if (sessionStorage.getItem("nextaxeversion") !== null) {
        sessionStorage.removeItem("nextaxeversion");
    }
}

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

if (typeof axeninjamndetail === 'undefined') {
    var axeninjamndetail = [[],[]];
}
if (typeof axeninjamndetail[0] === 'undefined') {
    axeninjamndetail[0] = [];
}
if (typeof axeninjamndetail[1] === 'undefined') {
    axeninjamndetail[1] = [];
}

if (typeof axeninjamndetailvin === 'undefined') {
    var axeninjamndetailvin = [[],[]];
}
if (typeof axeninjamndetailvin[0] === 'undefined') {
    axeninjamndetailvin[0] = [];
}
if (typeof axeninjamndetailvin[1] === 'undefined') {
    axeninjamndetailvin[1] = [];
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

if (typeof axeninjaqueryexplorer === 'undefined') {
    var axeninjaqueryexplorer = [[],[]];
}
if (typeof axeninjaqueryexplorer[0] === 'undefined') {
    axeninjaqueryexplorer[0] = [];
}
if (typeof axeninjaqueryexplorer[1] === 'undefined') {
    axeninjaqueryexplorer[1] = [];
}

if (typeof axeninjatxexplorer === 'undefined') {
    var axeninjatxexplorer = [[],[]];
}
if (typeof axeninjatxexplorer[0] === 'undefined') {
    axeninjatxexplorer[0] = [];
}
if (typeof axeninjatxexplorer[1] === 'undefined') {
    axeninjatxexplorer[1] = [];
}

function tableLocalNodesRefresh(){
    tableLocalNodes.api().ajax.reload();
    // Set it to refresh in 60sec
    setTimeout(tableLocalNodesRefresh, 60000);
};

function tableBlockConsensusRefresh(){
    tableBlockConsensus.api().ajax.reload();
    // Set it to refresh in 60sec
    setTimeout(tableLocalNodesRefresh, 150000);
};

function tableMNListRefresh(){
    tableMNList.api().ajax.reload();
    // Set it to refresh in 60sec
    setTimeout(tableMNListRefresh, 300000);
};

function mnpaymentsRefresh(){
    $.getJSON( "/api/masternodes/stats?testnet="+axeninjatestnet, function( data ) {
        var date = new Date();
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#mnpaymentsLR').text( n + ' ' + time );
        $('#mnpayments').text( Math.round(data.data.MasternodeStatsTotal.MasternodeExpectedPayment*10000)/10000 );
        $('#mnpaymentsratio').text( (Math.round(data.data.MasternodeStatsTotal.RatioPayed*10000)/100)+ '%' );
        setTimeout(mnpaymentsRefresh, 300000);
    });
};

function displayaxeVersion(axeversion,sentinelversion) {
    if (axeversion != "?") {
        $('#msgalert').show();
    }
    else {
        $('#msgalert').hide();
    }
    $('#currentaxeversion').text( axeversion );
    $('#currentsentinelversion').text( sentinelversion );
}

function getLatestaxeVersion() {
    var currentdate = new Date();
    axeversion = sessionStorage.getItem("currentaxeversion");
    sentinelversion = sessionStorage.getItem("currentsentinelversion");
    var nextdate = sessionStorage.getItem("nextaxeversion");
    if ((( axeversion === null ) || (sentinelversion === null)
            || ( sessionStorage.getItem("nextaxeversion") === null )
            || ( sessionStorage.getItem("nextaxeversion") < currentdate.getTime() )) && (axeversionsemaphore == false)) {
        axeversionsemaphore = true;
        $.getJSON( "/axeninja-latestversion.json?nocache="+ (new Date()).getTime(), function( data ) {
            sessionStorage.setItem('currentaxeversion', data.version.string);
            sessionStorage.setItem('currentsentinelversion', data.sentinelversion.string);
            var currentdate = new Date();
            currentdate = new Date(currentdate.getTime() + 15*60000);
            sessionStorage.setItem('nextaxeversion', currentdate.getTime());
            axeversionsemaphore = false;
            displayaxeVersion(data.version.string,data.sentinelversion.string);
        });
        axeversion = axeversiondefault;
        sentinelversion = sentinelversiondefault;
    }
    else {
        if (axeversion === null) {
            axeversion = axeversiondefault;
        }
        if (sentinelversion === null) {
            sentinelversion = sentinelversiondefault;
        }
        displayaxeVersion(axeversion,sentinelversion);
    }
    if ((axeversion.length > 2) && (axeversion.substr(axeversion.length - 2) == ".0")) {
        axeversioncheck = axeversion.substr(0,axeversion.length-2);
    }
    else {
        axeversioncheck = axeversion;
    }
    return axeversioncheck;
};

function getVoteLimit() {
    $.getJSON("/data/votelimit-" + axeninjatestnet+".json", function (data) {
        var cls = "panel-red";
        if (data.data.votelimit.nextvote.BlockTime == 0) {
            var datevotelimit = new Date(data.data.votelimit.nextsuperblock.BlockTime * 1000);
            $('#nextvotelimithr').text( "Too late! Superblock on "+datevotelimit.toLocaleString());
        }
        else {
            $('#nextvotelimithr').text(deltaTimeStampHRlong(data.data.votelimit.nextvote.BlockTime, currenttimestamp()));
            if ((data.data.votelimit.nextvote.BlockTime - currenttimestamp()) <= 86400) {
                cls = "panel-yellow";
            }
            else {
                cls = "panel-green";
            }
        }
        $('#nextvotepanel').removeClass("panel-green").removeClass("panel-red").removeClass("panel-yellow").addClass(cls);
    });
};


$(document).ready(function() {

    $('#axeninjajsversion').text(axeninjaversion).addClass("label-info").removeClass("label-danger");

    if (axeninjatestnet == 1) {
        $('#testnetalert').show();
        $('a[name=menuitemexplorer]').attr("href", "https://" + axeninjatestnetexplorer);
        if (typeof axeninjatestnettor !== 'undefined') {
            $('a[name=axeninjatorurl]').attr("href", "http://"+axeninjatestnettor+"/masternodes-classic.html");
            $('span[name=axeninjatordisplay]').show();
        }

        if (typeof axeninjatestneti2p !== 'undefined') {
            $('a[name=axeninjai2purl]').attr("href", "http://" + axeninjatestneti2p + "/masternodes-classic.html");
            $('span[name=axeninjai2pdisplay]').show();
        }
    }
    else {
        if (typeof axeninjator !== 'undefined') {
            $('a[name=axeninjatorurl]').attr("href", "http://"+axeninjator+"/masternodes-classic.html");
            $('span[name=axeninjatordisplay]').show();
        }

        if (typeof axeninjai2p !== 'undefined') {
            $('a[name=axeninjai2purl]').attr("href", "http://" + axeninjai2p + "/masternodes-classic.html");
            $('span[name=axeninjai2pdisplay]').show();
        }
    }

    getLatestaxeVersion();
    getVoteLimit();

    var pkutxt = '<ul>';
    var ix = 0;
    for (var i = 0, ien = axeninjamndetail[axeninjatestnet].length; i < ien; i++) {
        if (ix == 0) {
            pkutxt += '<li>[Link]';
        } else {
            pkutxt += '<li>[' + ix + ']';
        }
        pkutxt += ' ' + axeninjamndetail[axeninjatestnet][i][1] + "</li>";
        ix++;
    }
    for (var i = 0, ien = axeninjaaddressexplorer[axeninjatestnet].length; i < ien; i++) {
        if (ix == 0) {
            pkutxt += '<li>[Link]';
        } else {
            pkutxt += '<li>[' + ix + ']';
        }
        pkutxt += ' ' + axeninjaaddressexplorer[axeninjatestnet][i][1] + "</li>";
        ix++;
    }
    pkutxt += '</ul>';
    $("#pubkeyurllist").html(pkutxt);

    $('#localnodes').on('xhr.dt', function (e, settings, json) {
        var date = new Date(json.data.cache.time*1000);
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#localnodesLR').text(n + ' ' + time);
        $('#localnodes').DataTable().column(1).search('^(?:(?!Disabled).)*$', true, false).draw();
        $('#localnodesLRHR').text( deltaTimeStampHRlong(json.data.cache.time, currenttimestamp())+" ago");
    });
    tableLocalNodes = $('#localnodes').dataTable({
        responsive: true,
        searching: false,
        dom: "Tfrtp",
        ajax: { url: "/data/nodesstatus-"+axeninjatestnet+".json",
            dataSrc: 'data.nodes',
            cache: true },
        "paging": false,
        columns: [
            {data: "NodeName"},
            {
                data: null, render: function (data, type, row) {
                if (data.NodeEnabled == 0) {
                    return '<img src="/static/status/daemon-disabled.png" width=16 height=16 /> Disabled';
                }
                else {
                    var iconurl = '<img src="/static/status/daemon-' + data.NodeProcessStatus + '.png" width=16 height=16 /> ';
                    if (data.NodeProcessStatus == 'running') {
                        return iconurl + 'Running';
                    } else if (data.NodeProcessStatus == 'stopped') {
                        return iconurl + 'Stopped';
                    } else if (data.NodeProcessStatus == 'notresponding') {
                        return iconurl + 'Not Responding';
                    } else {
                        return data.NodeProcessStatus;
                    }
                }
            }
            },
            {
                data: null, render: function (data, type, row) {
                var outtxt = '';
                if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                    outtxt = data.NodeVersion;
                }
                return outtxt;
            }
            },
            {
                data: null, render: function (data, type, row) {
                var outtxt = '';
                if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                    outtxt = data.NodeProtocol;
                }
                return outtxt;
            }
            },
            {
                data: null, render: function (data, type, row) {
                var outtxt = '';
                if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                    outtxt = data.NodeBlocks;
                }
                return outtxt;
            }
            },
            {
                data: null, render: function (data, type, row) {
                var outtxt = '';
                if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                    if (type != 'sort') {
                        if (axeninjablockexplorer[axeninjatestnet].length > 0) {
                            outtxt += '<a href="' + axeninjablockexplorer[axeninjatestnet][0][0].replace('%%b%%', data.NodeLastBlockHash) + '">' + data.NodeLastBlockHash + '</a>';
                            for (var i = 1, ien = axeninjablockexplorer[axeninjatestnet].length; i < ien; i++) {
                                outtxt += '<a href="' + axeninjablockexplorer[axeninjatestnet][i][0].replace('%%b%%', data.NodeLastBlockHash) + '">[' + i + ']</a>';
                            }
                        }
                    }
                    else {
                        outtxt = data.NodeLastBlockHash;
                    }
                }
                return outtxt;
            }
            },
            {
                data: null, render: function (data, type, row) {
                var outtxt = '';
                if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                    outtxt = data.NodeConnections;
                }
                return outtxt;
            }
            }
        ]
    });
    setTimeout(tableLocalNodesRefresh, 60000);

    $('#blockconsensus').on('xhr.dt', function (e, settings, json) {
        var date = new Date(json.data.cache.time*1000);
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#blockconsensusLR').text(n + ' ' + time);
        $('#blockconsensusLRHR').text( deltaTimeStampHRlong(json.data.cache.time, currenttimestamp())+" ago");
    });
    tableBlockConsensus = $('#blockconsensus').dataTable({
        dom: "Trtp",
        responsive: true,
        searching: false,
        ajax: { url: "/data/blocksconsensus-"+axeninjatestnet+".json",
            dataSrc: 'data.blocksconsensus',
            cache: true },
        "paging": false,
        "order": [[0, "desc"]],
        columns: [
            {data: "BlockID"},
            {
                data: null, render: function (data, type, row) {
                return (Math.round(data.Consensus * 10000) / 100) + '%';
            }
            },
            {
                data: null, render: function (data, type, row) {
                if (data.ConsensusPubKey == '') {
                    return "<i>None</i>";
                } else {
                    return data.ConsensusPubKey;
                }
            }
            },
            {
                data: null, render: function (data, type, row) {
                var str = '<ul>';
                var sstr = '';
                for (var col in data.Others) {
                    str += '<li>';
                    if (data.Others[col].Payee == '') {
                        str += '<i>None</i>';
                    } else {
                        str += data.Others[col].Payee;
                    }
                    str += ' (' + (Math.round(data.Others[col].RatioVotes * 10000) / 100) + '% - Nodes: ';
                    sstr = '';
                    for (var uname in data.Others[col].NodeNames) {
                        if (sstr != '') {
                            sstr += ' ';
                        }
                        sstr += data.Others[col].NodeNames[uname];
                    }
                    str += sstr + ')</li>'
                }
                ;
                return str + '</ul>';
            }
            }
        ],
        "createdRow": function (row, data, index) {
            if (data.Consensus == 1) {
                $('td', row).eq(1).removeClass("danger").removeClass("success").addClass("success");
            } else {
                $('td', row).eq(1).removeClass("danger").removeClass("success").addClass("danger");
            }
        }
    });
    setTimeout(tableBlockConsensusRefresh, 150000);

    chartMNVersions = $('#mnversions').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,//null,
            plotShadow: false
        },
        title: {
            text: ''
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Masternode version',
            data: [['Unknown', 100]]
        }]
    });

    $('#mnregexp').on('keyup click', function () {
        $('#mnlist').DataTable().search($('#mnregexp').val(), true, false).draw();
    });

    $('#mnregexp').val(getParameter("mnregexp"));

    $('#mnlist').on('xhr.dt', function ( e, settings, json ) {
        var date = new Date(json.data.cache.time*1000);
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        var activeCount = 0;
        var uniqueIPs = [];
        $('#mnlistLR').text( n + ' ' + time);
        $('#mnlistLRHR').text( deltaTimeStampHRlong(json.data.cache.time, currenttimestamp())+" ago");
        var versioninfo = 'Unknown';
        var dataVersionCount = [];
        var mnregexp = $('#mnregexp').val();
        for ( var i=0, ien=json.data.masternodes.length ; i<ien ; i++ ) {
            if (parseInt(json.data.masternodes[i].MasternodeProtocol) > axemaxprotocol) {
                axemaxprotocol = parseInt(json.data.masternodes[i].MasternodeProtocol);
            }
            if (json.data.masternodes[i].ActiveCount > 0) {
                activeCount++;
            }
            if (uniqueIPs.indexOf(json.data.masternodes[i].MasternodeIP+":"+json.data.masternodes[i].MasternodePort) == -1) {
                uniqueIPs.push( json.data.masternodes[i].MasternodeIP+":"+json.data.masternodes[i].MasternodePort );
            }
            if ((json.data.masternodes[i].Portcheck != false) && json.data.masternodes[i].Portcheck.hasOwnProperty("SubVer")) {
                if ((json.data.masternodes[i].Portcheck.SubVer.length > 10) && (json.data.masternodes[i].Portcheck.SubVer.substring(0,9) == '/Satoshi:') && (json.data.masternodes[i].Portcheck.SubVer.substring(json.data.masternodes[i].Portcheck.SubVer.length-1) == '/')) {
                    versioninfo = json.data.masternodes[i].Portcheck.SubVer.substring(9,json.data.masternodes[i].Portcheck.SubVer.indexOf('/',10));
                }
                else if ((json.data.masternodes[i].Portcheck.SubVer.length > 7) && (json.data.masternodes[i].Portcheck.SubVer.substring(0,6) == '/Core:') && (json.data.masternodes[i].Portcheck.SubVer.substring(json.data.masternodes[i].Portcheck.SubVer.length-1) == '/')) {
                    versioninfo = json.data.masternodes[i].Portcheck.SubVer.substring(6,json.data.masternodes[i].Portcheck.SubVer.indexOf('/',6));
                }
                else if ((json.data.masternodes[i].Portcheck.SubVer.length > 11) && (json.data.masternodes[i].Portcheck.SubVer.substring(0,11) == '/Axe Core:') && (json.data.masternodes[i].Portcheck.SubVer.substring(json.data.masternodes[i].Portcheck.SubVer.length-1) == '/')) {
                    versioninfo = json.data.masternodes[i].Portcheck.SubVer.substring(11,json.data.masternodes[i].Portcheck.SubVer.indexOf('/',11));
                }
                else {
                    versioninfo = "Unknown";
                }
            }
            else {
                versioninfo = "Unknown";
            }
            versioninfo = versioninfo+" ("+json.data.masternodes[i].MasternodeProtocol+")";
            if (dataVersionCount.hasOwnProperty(versioninfo)) {
                dataVersionCount[versioninfo]++;
            }
            else {
                dataVersionCount[versioninfo] = 1;
            }
        }

        var dataSet = [];
        for (version in dataVersionCount) {
            if (dataVersionCount.hasOwnProperty(version)) {
                dataSet.push( [version, Math.round((dataVersionCount[version]/json.data.masternodes.length)*10000)/100] );
            }
        }
        chartMNVersions = $('#mnversions').highcharts();
        chartMNVersions.series[0].setData(dataSet,true);

        var inactiveCount = json.data.masternodes.length - activeCount;

        $('#mnactive').text( activeCount );
        $('#mninactive').text( inactiveCount );
        $('#mntotal').text( json.data.masternodes.length );
        $('#uniquemnips').text( uniqueIPs.length );

        if (mnregexp != "") {
            $('#mnlist').DataTable().search(mnregexp, true, false).draw();
        }
    } );
    tableMNList = $('#mnlist').dataTable( {
        ajax: { url: "/data/masternodeslistfull-"+axeninjatestnet+".json",
                dataSrc: 'data.masternodes',
            cache: true },
        lengthMenu: [ [50, 100, 250, 500, -1], [50, 100, 250, 500, "All"] ],
        processing: true,
        pageLength: 50,
        columns: [
            { data: null, render: function ( data, type, row ) {
                var outtxt = '';
                if (type != 'sort') {
                    if ((axeninjamndetailvin[axeninjatestnet].length > 0) || (axeninjatxexplorer[axeninjatestnet].length > 0)) {
                        var ix = 0;
                        for ( var i=0, ien=axeninjamndetailvin[axeninjatestnet].length ; i<ien ; i++ ) {
                            if (ix == 0) {
                                outtxt += '<a href="'+axeninjamndetailvin[axeninjatestnet][0][0].replace('%%a%%',data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex)+'" data-toggle="tooltip" data-placement="left" title="'+data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex+'">'+data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex+'</a>';
                            }
                            else {
                                outtxt += '<a href="'+axeninjamndetailvin[axeninjatestnet][i][0].replace('%%a%%',data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex)+'">['+ix+']</a>';
                            }
                            ix++;
                        }
                        for ( var i=0, ien=axeninjatxexplorer[axeninjatestnet].length ; i<ien ; i++ ) {
                            if (ix == 0) {
                                outtxt += '<a href="'+axeninjatxexplorer[axeninjatestnet][0][0].replace('%%a%%',data.MasternodeOutputHash)+'" data-toggle="tooltip" data-placement="left" title="'+data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex+'">'+data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex+'</a>';
                            }
                            else {
                                outtxt += '<a href="'+axeninjatxexplorer[axeninjatestnet][i][0].replace('%%a%%',data.MasternodeOutputHash)+'">['+ix+']</a>';
                            }
                            ix++;
                        }
                    }
                    else {
                        outtxt = data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex;
                    }
                }
                else {
                    outtxt = data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex;
                }
                return outtxt;
            } },
            { data: null, render: function ( data, type, row) {
                var outtxt = '';
                if (type != 'sort') {
                    if ((axeninjamndetail[axeninjatestnet].length > 0) || (axeninjaaddressexplorer[axeninjatestnet].length > 0)) {
                        var ix = 0;
                        for ( var i=0, ien=axeninjamndetail[axeninjatestnet].length ; i<ien ; i++ ) {
                            if (ix == 0) {
                                outtxt += '<a href="'+axeninjamndetail[axeninjatestnet][0][0].replace('%%a%%',data.MasternodePubkey)+'">'+data.MasternodePubkey+'</a>';
                            }
                            else {
                                outtxt += '<a href="'+axeninjamndetail[axeninjatestnet][i][0].replace('%%a%%',data.MasternodePubkey)+'">['+ix+']</a>';
                            }
                            ix++;
                        }
                        for ( var i=0, ien=axeninjaaddressexplorer[axeninjatestnet].length ; i<ien ; i++ ) {
                            if (ix == 0) {
                                outtxt += '<a href="'+axeninjaaddressexplorer[axeninjatestnet][0][0].replace('%%a%%',data.MasternodePubkey)+'">'+data.MasternodePubkey+'</a>';
                            }
                            else {
                                outtxt += '<a href="'+axeninjaaddressexplorer[axeninjatestnet][i][0].replace('%%a%%',data.MasternodePubkey)+'">['+ix+']</a>';
                            }
                            ix++;
                        }
                    }
                    else {
                        outtxt = data.MasternodePubkey;
                    }
                }
                else {
                    outtxt = data.MasternodePubkey;
                }
                return outtxt;
            } },
            { data: null, render: function ( data, type, row ) {
                var mnip = "";
                if ( data.MasternodeIP == "::" ) {
                    mnip = data.MasternodeTor+".onion";
                }
                else {
                    mnip = data.MasternodeIP;
                }
                return mnip+':'+data.MasternodePort;
            } },
            { data: null, render: function ( data, type, row) {
                    var activecount = parseInt(data.ActiveCount);
                    var inactivecount = parseInt(data.InactiveCount);
                    var unlistedcount = parseInt(data.UnlistedCount);
                    var total = activecount+inactivecount+unlistedcount;
                    var ratio = activecount / total;
                    var result = ratio;
                    if (type == 'sort') {
                        result =  ratio;
                    } else {
                        if ( ratio == 1 ) {
                            result = 'Active';
                        } else if ( ratio == 0 ) {
                            result = 'Inactive';
                        } else if ( unlistedcount > 0 ) {
                            result = 'Partially Unlisted';
                        } else {
                            result = 'Partially Inactive';
                        }
                        result += ' ('+Math.round(ratio*100)+'%)';
                    }
                    return result;
                } },
            { data: null, render: function ( data, type, row ) {
                var txt = "";
                if (data.Portcheck != false) {
                    txt = data.Portcheck.Result;
                    if ((data.Portcheck.Result == 'closed') || (data.Portcheck.Result == 'timeout')) {
                        txt = "Closed";
                    } else if (data.Portcheck.Result == 'unknown') {
                        txt = "Pending";
                    } else if ((data.Portcheck.Result == 'open') || (data.Portcheck.Result == 'rogue')) {
                        txt = "Open";
                    }
                    if (data.Portcheck.NextCheck < currenttimestamp()) {
                        if (txt != "Pending") {
                            txt = txt + ' (Re-check pending)';
                        }
                    }
                    else {
                        txt = txt + ' (' + deltaTimeStampHR(data.Portcheck.NextCheck,currenttimestamp())+')';
                    }
                }
                else {
                    txt = "<i>Unknown</i>";
                }
                return txt;
            } },
            { data: null, render: function ( data, type, row ) {
                var versioninfo = '<i>Unknown</i>';
                if ((data.Portcheck != false) && data.Portcheck.hasOwnProperty("SubVer")) {
                    if ((data.Portcheck.SubVer.length > 10) && (data.Portcheck.SubVer.substring(0,9) == '/Satoshi:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length-1) == '/')) {
                        versioninfo = data.Portcheck.SubVer.substring(9,data.Portcheck.SubVer.indexOf('/',10));
                    }
                    else if ((data.Portcheck.SubVer.length > 7) && (data.Portcheck.SubVer.substring(0,6) == '/Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length-1) == '/')) {
                        versioninfo = data.Portcheck.SubVer.substring(6,data.Portcheck.SubVer.indexOf('/',6));
                    }
                    else if ((data.Portcheck.SubVer.length > 11) && (data.Portcheck.SubVer.substring(0,11) == '/Axe Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length-1) == '/')) {
                        versioninfo = data.Portcheck.SubVer.substring(11,data.Portcheck.SubVer.indexOf('/',11));
                    }
                }
                return versioninfo;
            } },
            { data: null, render: function ( data, type, row ) {
                return data.MasternodeProtocol;
            } },
            { data: null, render: function ( data, type, row) {
                var balance = parseFloat(data.Balance.Value);
                if (type == 'sort') {
                    return balance;
                }
                else {
                    var num = Math.round( balance * 1000 ) / 1000;
                    return addCommas( num.toFixed(3) );
                }
            } },
            { data: null, render: function ( data, type, row) {
                var lastpaid = parseInt(data.MasternodeLastPaid);
                if (lastpaid > 0) {
                    if (type == 'sort') {
                        return lastpaid;
                    }
                    else {
                        var outtxt = '';
                        outtxt = deltaTimeStampHR(lastpaid,currenttimestamp());
                        return outtxt;
                    }
                }
                else {
                    if (type == 'sort') {
                        return 0;
                    }
                    else {
                        return 'Never/Unknown';
                    }
                }
            } },
            { data: null, render: function ( data, type, row) {
                var activeseconds = parseInt(data.MasternodeActiveSeconds);
                if (type == 'sort') {
                    return activeseconds;
                } else if (activeseconds < 0) {
                    return 'Just now ('+activeseconds+')';
                }
                else {
                    return diffHR(activeseconds);
                }
            } },
            { data: null, render: function ( data, type, row) {
                if (type == 'sort') {
                    return data.MasternodeLastSeen;
                } else if (data.MasternodeLastSeen > 0) {
                    return deltaTimeStampHR(data.MasternodeLastSeen,currenttimestamp());
                } else {
                    return '';
                }
            } },
        ],
        "createdRow": function ( row, data, index ) {
            axeversioncheck = getLatestaxeVersion();
            var activecount = parseInt(data.ActiveCount);
            var inactivecount = parseInt(data.InactiveCount);
            var unlistedcount = parseInt(data.UnlistedCount);
            var total = activecount+inactivecount+unlistedcount;
            var ratio = activecount / total;
            if (ratio == 1) {
                color = 'success';
            } else if (ratio == 0) {
                color = 'danger';
            } else {
                color = 'warning';
            }
            $('td',row).eq(3).removeClass("danger").removeClass("success").removeClass("warning").addClass(color).css({"text-align": "center"});
            var color = 'danger';
            if ( data.Portcheck == false ) {
                color = 'warning';
            }
            else {
                if (( data.Portcheck.Result == 'open' ) || ( data.Portcheck.Result == 'rogue' )) {
                    color = 'success';
                } else if (data.Portcheck.Result == 'unknown') {
                    color = 'warning';
                }
            }
            $('td',row).eq(4).removeClass("danger").removeClass("success").removeClass("warning").addClass(color).css({"text-align": "center"});
            color = 'success';
            if ( data.Balance.Value < 1000 ) {
                color = 'danger';
            }
            $('td',row).eq(7).removeClass("danger").removeClass("success").addClass(color).css({"text-align": "right"});
            var versioninfo = "Unknown";
            if ((data.Portcheck != false) && data.Portcheck.hasOwnProperty("SubVer")) {
                if ((data.Portcheck.SubVer.length > 10) && (data.Portcheck.SubVer.substring(0, 9) == '/Satoshi:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length - 1) == '/')) {
                    versioninfo = data.Portcheck.SubVer.substring(9, data.Portcheck.SubVer.indexOf('/', 10));
                }
                else if ((data.Portcheck.SubVer.length > 7) && (data.Portcheck.SubVer.substring(0, 6) == '/Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length - 1) == '/')) {
                    versioninfo = data.Portcheck.SubVer.substring(6, data.Portcheck.SubVer.indexOf('/', 6));
                }
                else if ((data.Portcheck.SubVer.length > 11) && (data.Portcheck.SubVer.substring(0, 11) == '/Axe Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length - 1) == '/')) {
                    versioninfo = data.Portcheck.SubVer.substring(11, data.Portcheck.SubVer.indexOf('/', 11));
                }
            }
            if ( versioninfo == "Unknown" ) {
                color = 'active';
            }
            else if ( ( versioninfo.substring(0,5) == "0.10." ) || ( versioninfo.substring(0,7) == "0.11." ) ) {
                color = 'danger';
            }
            else if ( versioninfo == axeversioncheck ) {
                color = 'success';
            }
            else {
                color = 'danger';
            }
            $('td',row).eq(5).removeClass("danger").removeClass("success").removeClass("warning").removeClass("active").addClass(color);
            var curprotocol = parseInt(data.MasternodeProtocol);
            if ( curprotocol < 70206 ) {
                color = 'danger';
            }
            else if ( curprotocol == axemaxprotocol ) {
                color = 'success';
            }
            else {
                color = 'warning';
            }
            $('td',row).eq(6).removeClass("danger").removeClass("success").addClass(color).css({"text-align": "right"});
        }
    } );
    var mnlistsize = getParameter("mnlistsize");
    if (mnlistsize != "") {
        $('#mnlist').DataTable().page.len(parseInt(mnlistsize));
    }


    setTimeout(tableMNListRefresh, 300000);

    //mnpaymentsRefresh();

});
