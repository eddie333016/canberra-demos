/* Shared map helper. OpenFreeMap vector style via MapLibre, Carto raster fallback. */
(function(){
  function circle(lng,lat,km){var pts=[],n=64;for(var i=0;i<=n;i++){var a=i/n*2*Math.PI;var dx=km/(111.32*Math.cos(lat*Math.PI/180))*Math.cos(a);var dy=km/110.57*Math.sin(a);pts.push([lng+dx,lat+dy]);}return {type:'Feature',geometry:{type:'Polygon',coordinates:[pts]}};}
  window.sfMap=function(id,o){
    var el=document.getElementById(id); if(!el||!window.maplibregl) return;
    var carto={version:8,sources:{c:{type:'raster',tiles:['https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png','https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'],tileSize:256,attribution:'&copy; OpenStreetMap contributors &copy; CARTO'}},layers:[{id:'c',type:'raster',source:'c'}]};
    var map=new maplibregl.Map({container:id,style:'https://tiles.openfreemap.org/styles/liberty',center:[o.lng,o.lat],zoom:o.zoom||13,cooperativeGestures:true,attributionControl:{compact:true,customAttribution:'OpenFreeMap &copy; OpenStreetMap contributors'}});
    var fell=false;map.on('error',function(e){if(!fell&&!map.isStyleLoaded()){fell=true;map.setStyle(carto);}});
    map.addControl(new maplibregl.NavigationControl({showCompass:false}),'top-right');
    function overlays(){
      if(o.radiusKm&&!map.getSource('area')){map.addSource('area',{type:'geojson',data:circle(o.lng,o.lat,o.radiusKm)});
        map.addLayer({id:'area-f',type:'fill',source:'area',paint:{'fill-color':o.color||'#1d4ed8','fill-opacity':0.12}});
        map.addLayer({id:'area-l',type:'line',source:'area',paint:{'line-color':o.color||'#1d4ed8','line-width':2,'line-dasharray':[2,2]}});}
    }
    map.on('style.load',overlays);
    map.on('load',function(){var a=el.querySelector('.maplibregl-ctrl-attrib');if(a){a.classList.remove('maplibregl-compact-show');a.removeAttribute('open');}});
    if(o.pin){var m=document.createElement('div');m.style.cssText='width:22px;height:22px;border-radius:50%;background:'+(o.color||'#1d4ed8')+';border:4px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)';new maplibregl.Marker({element:m}).setLngLat([o.pinLng||o.lng,o.pinLat||o.lat]).addTo(map);}
    return map;
  };
})();
