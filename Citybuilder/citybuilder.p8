pico-8 cartridge // http://www.pico-8.com
version 18
__lua__
-- main functions

------- synergies --------
--[[

 syns={b,mpc,mps,nb,d,c,n}

 b   : building
 mpc : money per click
 mps : money per sec
 nb  : number of buildings
 d   : discovered ?
 c   : color of the synergy
 n   : name of the synergy

]]
--------------------------

poke(0x5f82,1)

function _init()
 -- max var: 32767.99

 -- global variables
 grid={
 	{{1},{1},{1},{1},{1}},
 	{{1},{1},{1},{1},{1}},
 	{{1},{1},{1},{1},{1}},
 	{{1},{1},{1},{1},{1}},
 	{{1},{1},{1},{1},{1}}
 }

 numbuilds=0
 maxheight=3
 t=0
 banks={}
 focus=false

 -- money
 m=0
 mps=0
 mpc=0
 mt=0
 showstatsp=false
 domusic=false
 dosounds=true
 menuitem(2, "stats+ on", toggle_statsp)
 menuitem(3, "music on", toggle_music)
 menuitem(4, "sounds off", toggle_sounds)

 -- player cursor
 cursx=54
 cursy=53
 cursox=0
 cursoy=0
 curspeed=1.5
 gridx=1
 gridy=1
 cursm=0
 curselect=false
 curselectid=1
 curscol=7
 curscol2=13
 focusy=1
 isclicking❎=false
 isclicking🅾️=false

 -- toolbar
 infoy=112
 infoty=112
 info=false

 -- main functions
 _upd=updategame
 _drw=drawgame

 -- utility
 dirx={-1,1,0,0,1,1,-1,-1}
 diry={0,0,-1,1,-1,1,1,-1}
 cursdirx={0,0,-1,1}
 cursdiry={-1,1,0,0}
 cursave1={0,112}

 -- rocks
 rt=0
 numrocks=0
 startrocks()

 -- arrays
 floats={}
 debug={}
end

function _update()
 _upd()
end

function _draw()
 _drw()

 -- debug --
 cursor(2,30)
 color(7)
 for d in all(debug) do
  print(d)
 end
end
-->8
-- updates

function updategame()
 if m>=32767 or m<-1000 then
  m=32767
  print2("you won",48,32,7,13,1)
  local str="time: "..flr(t/30).."sec"
  print2(str,64-#str*2,40,7,13,1)
  stop()
 else
  t+=1
 end

 curshandle()
 updatefocus()
 updatepos()
 updatetools()
 moneycheck()
 clicker()
 updatefloats()
 spawnrocks()
end
-->8
-- draw

function drawgame()
 cls(focus and 6 or 12)

 local sx=53
 local sy=50
 local x=53
 local y=50
 local sty

 local bcurs
 local icurs
 local tcurs
 local stycurs
 local xcurs
 local ycurs

 palt(14,true)
 palt(0,false)
 for gi,g in pairs(grid) do
  for ti,t in pairs(g) do
   sty=0
   for i,b in pairs(t) do
    if gi==gridx and ti==gridy and cursm==0 then
     if b==1 and t[i+1]==nil then
      bcurs=1
      stycurs=0
     else
      bcurs=t[2]
      stycurs=-11
     end
     icurs=i
     tcurs=t
     xcurs=x
     ycurs=y
    end
    if b!=9 and b!=10 then
     sty-=tools[b].height
    end
    if b==9 and not focus then
     spr(166,x,y+sty,3,2)
    elseif b==10 and not focus then
     spr(169,x,y+sty,3,2)
    else
     if b==1 then
      spr(tools[b].sp,x,y+sty,tools[b].w,tools[b].h)
     elseif b!=9 and b!=10 and focus and gi==gridx and ti==gridy or not focus then
      spr(tools[b].sp,x,y+sty,tools[b].w,tools[b].h)
     end
    end
    if focus and (gi!=gridx or ti!=gridy) then
    	print(flr(#t/2),x+10,y+4,0)
    	print(flr(#t/2),x+9,y+4,7)
    end
   end
   x+=10
   y+=5
  end
  sx-=10
  sy+=5
  x=sx
  y=sy
 end


 -- synergies
 if focus then
  for i=1,4 do
   if grid[gridx+dirx[i]]!=nil and grid[gridx+dirx[i]][gridy+diry[i]]!=nil and grid[gridx+dirx[i]][gridy+diry[i]][focusy]!=nil then
    local nb=grid[gridx+dirx[i]][gridy+diry[i]][focusy]
    local numb=ntiles[gridx][gridy][focusy][nb]
    local posx=pos[gridx+dirx[i]][gridy+diry[i]][focusy][1]
    local posy=pos[gridx+dirx[i]][gridy+diry[i]][focusy][2]
				local tb=grid[gridx][gridy][focusy]
    if tb!=9 and tb!=10 then
     for si,s in pairs(tools[grid[gridx][gridy][focusy]].syns) do
      local height=tools[grid[gridx+dirx[i]][gridy+diry[i]][focusy]].height
      if s[1]==nb and s[4]==numb then
       pal(7,s[6])
       palt(14,true)
       palt(0,false)
       spr(64,posx+1,posy+height,3,2)
      end
     end
    end
   end
  end
 end


 -- cursor

 palt(14,true)
 palt(0,false)
 local by=-2
 if cursm==0 then
  for i,b in pairs(grid[gridx][gridy]) do
   if (focus and i==focusy) or not focus then
    if b==1 and grid[gridx][gridy][2]==nil then
     sproutline(67,cursx-1+cursox,cursy-3+by+cursoy,7,3,2)
     spr(67,xcurs+cursox,ycurs+by+cursoy,3,2)
    elseif b==2 then
     sproutline(4,cursx-1+cursox,cursy-14+by+cursoy,7,3,3)
     spr(4,xcurs+cursox,ycurs-11+by+cursoy,3,3)
     by-=15
    elseif b==3 then
     sproutline(7,cursx-1+cursox,cursy-14+by+cursoy,7,3,3)
     spr(7,xcurs+cursox,ycurs-11+by+cursoy,3,3)
     by-=15
    elseif b==4 then
     sproutline(10,cursx-1+cursox,cursy-14+by+cursoy,7,3,3)
     spr(10,xcurs+cursox,ycurs-11+by+cursoy,3,3)
     by-=15
    elseif b==5 then
     sproutline(13,cursx-1+cursox,cursy-5+by+cursoy,7,3,2)
     spr(13,xcurs+cursox,ycurs-2+by+cursoy,3,2)
     by-=15
    elseif b==6 then
     sproutline(128,cursx-1+cursox,cursy-14+by+cursoy,7,3,3)
     spr(128,xcurs+cursox,ycurs-11+by+cursoy,3,3)
     by-=15
    elseif b==7 then
     sproutline(131,cursx-1+cursox,cursy-14+by+cursoy,7,3,3)
     spr(131,xcurs+cursox,ycurs-11+by+cursoy,3,3)
    elseif b==9 then
     sproutline(166,cursx-1+cursox,cursy-3+by+cursoy,7,3,2)
     spr(166,xcurs+cursox,ycurs+by+cursoy,3,2)
    elseif b==10 then
     sproutline(169,cursx-1+cursox,cursy-3+by+cursoy,7,3,2)
     spr(169,xcurs+cursox,ycurs+by+cursoy,3,2)
    end
   end
   if focus then
    if b==2 then
     by-=15
    elseif b==3 then
     by-=15
    elseif b==4 then
     by-=15
    elseif b==5 then
     by-=15
    elseif b==6 then
     by-=15
    elseif b==7 then
     by-=15
    end
   end
  end
 end

 pal()

 -- coin
 if mpc > 0 then
	 if cursm==2 and not isclicking❎ and not isclicking🅾️ then
	  pal(7,15)
	 elseif isclicking❎ or isclicking🅾️ then
	  pal(7,10)
	 end
	 palt(14,true)
	 palt(0,false)
	 spr(137,111,95,2,2)
	 pal()
	end

 -- information
 infoy+=(infoty-infoy)/3
 rectfill(0,infoy+1,127,infoy+32,1)
 if cursm==1 and info then
  print2(tools[cursm==1 and cursx/16+1].name,5,infoy+5,7,13)
  print(tools[cursm==1 and cursx/16+1].desc,4,infoy+13,7)
 end

 -- toolbar
 rectfill(0,112,127,127,1)
 for i=0,7 do
  palt(0,false)
  spr(74,i*15+i,112,2,2)
  pal()
  if curselect and curselectid==i+1 then
   spr(70,i*15+i,112,2,2)
  end
  if cursm==1 and cursx/16==i then
   spr(72,i*15+i,112,2,2)
  end
  spr(96+i*2,i*15+i,112,2,2)
 end

pal()

 for f in all(floats) do
  if not focus then
  	print2(f.txt,f.x,f.y,7,13,1)
  end
 end

 -- global stats

 print2(m.."$",2,2,7,13,1)
 print2(mpc.."/click",2,10,7,13,1)
 print2(mps.."/sec",2,18,7,13,1)

 -- focus mode

 if focus then
  local b=grid[gridx][gridy][focusy]
  local t=tools[grid[gridx][gridy][focusy]]
  local str
  local y=2
  if b!=10 and b!=9 then
   if b!=nil and b!=1 and b!=9 and b!=10 then
    str=t.name
    print2(str,127-#str*4,y,7,13,1)
    y+=8
    if b!=7 then

     local _mpc=t.mpc
     local _mps=t.mps

     for ni,n in pairs(ntiles[gridx][gridy][focusy]) do
      for si,s in pairs(tools[b].syns) do
       if s[1]==ni and s[4]==n then
        _mpc+=s[2]
        _mps+=s[3]
       end
      end
     end

     if t.mpc!=0 then
      if showstatsp then
       str=_mpc.."/click ("..arr(_mpc/mpc*100) .."%)"
      else
       str=_mpc.."/click"
      end
      print2(str,127-#str*4,y,7,13,1)
      y+=8
     end
     if t.mps!=0 then
      if showstatsp then
       str=_mps.."/sec ("..arr(_mps/mps*100) .."%)"
      else
       str=_mps.."/sec"
      end
      print2(str,127-#str*4,y,7,13,1)
      y+=8
     end
    else
     for i in all(banks) do
      if i.tx==gridx and i.ty==gridy and i.z==focusy then
       str="-25$ in "..arr(i.mt/30).."sec"
       print2(str,127-#str*4,y,7,13,1)
       y+=8
       str="+"..arr(m*(4/100)).."$ in "..arr(i.gt/30).."sec"
       print2(str,127-#str*4,y,7,13,1)
      end
     end
    end
   end
  else
   if b==9 then
   	str="small rock"
   else
    str="big rock"
   end
   print2(str,127-#str*4,2,7,13,1)
   y+=8
   if b==9 then
   	str="+17 on destroy"
   else
    str="+25 on destroy"
   end
   print2(str,127-#str*4,y,7,13,1)
  end
 end
end
-->8
-- gameplay

function curshandle()
 cursox+=(0-cursox)/curspeed
 cursoy+=(0-cursoy)/curspeed

 if cursm==0 then
  if btnp(⬅️) and gridy>1 then
   cursx-=10
   cursy-=5
   cursox+=10
   cursoy+=5
   gridy-=1
  elseif btnp(➡️) then
   if gridy<5 then
    cursx+=10
    cursy+=5
    cursox-=10
    cursoy-=5
    gridy+=1
   else
   	if mpc > 0 then
	    local mapx=cursx
	    local mapy=cursy
	    local mapgx=gridx
	    local mapgy=gridy
	    cursm=2
	    focus=false
	    cursave0={mapx,mapy,mapgx,mapgy}
   	else
   		local mapx=cursx
	    local mapy=cursy
	    local mapgx=gridx
	    local mapgy=gridy
	    cursm=1
	    focus=false
	    cursx=cursave1[1]
	    cursy=cursave1[2]
	    cursave0={mapx,mapy,mapgx,mapgy}
   	end
   end
  elseif btnp(⬆️) and gridx>1 then
   cursx+=10
   cursy-=5
   cursox-=10
   cursoy+=5
   gridx-=1
  elseif btnp(⬇️) then
   if gridx<5 then
    cursx-=10
    cursy+=5
    cursox+=10
    cursoy-=5
    gridx+=1
   else
    local mapx=cursx
    local mapy=cursy
    local mapgx=gridx
    local mapgy=gridy
    cursm=1
    focus=false
    cursx=cursave1[1]
    cursy=cursave1[2]
    cursave0={mapx,mapy,mapgx,mapgy}
   end
  elseif btnp(🅾️) then
   if curselect and not focus then
   	placebuilding(curselectid,gridx,gridy)
   elseif focus then
    focusy+=1
   end
  elseif btnp(❎) then
   if focus then
    focus=false
   else
    focus=true
   end
  end
 elseif cursm==1 then
  if btnp(⬅️) then
   if cursx>0 then
    cursx-=16
    info=false
    infoty=112
   else
    cursx=112
    info=false
    infoty=112
   end
  elseif btnp(➡️) then
   if cursx<112 then
    cursx+=16
    info=false
    infoty=112
   else
    cursx=0
    info=false
    infoty=112
   end
  elseif btnp(⬆️) then
   if cursx/16+1!=8 then
    cursm=0
   else
   	if mpc > 0 then
    	cursm=2
    else
    	cursm=0
    end
   end
   local toolx=cursx
   local tooly=cursy
   cursx=cursave0[1]
   cursy=cursave0[2]
   gridx=cursave0[3]
   gridy=cursave0[4]
   cursave1={toolx,tooly}
   info=false
   infoty=112
  elseif btnp(⬇️) then
   if info then
    info=false
    infoty=112
   else
    info=true
    infoty=112-32
   end
  elseif btnp(🅾️) then
   if curselect then
    if curselectid==cursx/16+1 then
     curselect,curscol=false,7,13
    else
     curselect,curscol=true,10,10
     curselectid=cursx/16+1
    end
   else
    curselect,curscol=true,10,10
    curselectid=cursx/16+1
   end
  end
 elseif cursm==2 then
  if btnp(⬆️) then
   cursm=0
   cursx=cursave0[1]
   cursy=cursave0[2]
   gridx=cursave0[3]
   gridy=cursave0[4]
  elseif btnp(⬇️) then
   cursm=1
   cursx=112
   cursy=112
  end
 end
end

function placebuilding(b,gx,gy)
 local topb=grid[gx][gy][#grid[gx][gy]]
 if not focus then
  if b==1 then
   if topb!=9 and topb!=10 then
    if grid[gx][gy][#grid[gx][gy]]!=1 then
     if grid[gx][gy][#grid[gx][gy]]==7 then
      del(banks,banks[#banks])
     end
     grid[gx][gy][#grid[gx][gy]]=nil
    end
   else
    local rp
    if topb==9 then
     m+=17
     rp=17
    else
     m+=25
     rp=25
    end
    grid[gx][gy][#grid[gx][gy]]=nil
    addfloat("+"..rp,pos[gx][gy][#grid[gx][gy]][1]+5,pos[gx][gy][#grid[gx][gy]][2])
   end
  elseif topb!=9 and topb!=10 then
   if grid[gx][gy][#grid[gx][gy]]==8then
    if b!=8 and b!=5 and m>tools[b].price then
    	grid[gx][gy][#grid[gx][gy]+1]=b
     m-=tools[b].price
     if b==7 then
      add(banks,{mt=15*30,gt=60*30,nm=0,tx=gridx,ty=gridy,z=#grid[gx][gy]})
     end
    end
   elseif b==8 then
    if grid[gx][gy][#grid[gx][gy]]!=1 and grid[gx][gy][#grid[gx][gy]]!=5 then
     if #grid[gx][gy]/2<maxheight then
      if m>tools[b].price then
      	grid[gx][gy][#grid[gx][gy]+1]=b
       m-=tools[b].price
      end
     end
    end
   elseif grid[gx][gy][2]==nil then
    if m>=tools[b].price then
     grid[gx][gy][2]=b
     m-=tools[b].price
     if b==7 then
      add(banks,{mt=15*30,gt=60*30,nm=0,tx=gridx,ty=gridy,z=2})
     end
    end
   end
  end
 end
end

function moneycheck()
 local _mpc=0
 local _mps=0
 numbuilds=0
 numrocks=0
 for g in all(grid) do
  for t in all(g) do
   for i in all(t) do
    if i!=8 and i!=1 and i!=9 and i!=10 then
     _mpc+=tools[i].mpc
     _mps+=tools[i].mps
     numbuilds+=1
    elseif i==9 or i==10 then
     numrocks+=1
    end
   end
  end
 end

 ------ synergies ------
 ntiles={}
 for x=1,5 do
  add(ntiles,{})
	 for y=1,5 do
	  add(ntiles[x],{})
	  for z=1,8 do
	  add(ntiles[x][y],{})
	   for b=1,8 do
	  		add(ntiles[x][y][z],0)
	  	end
	  end
	 end
	end

 for xi,x in pairs(grid) do
  for yi,y in pairs(x) do
   for zi,b in pairs(y) do

    for i=1,4 do
     if grid[xi+dirx[i]]!=nil and grid[xi+dirx[i]][yi+diry[i]]!=nil and grid[xi+dirx[i]][yi+diry[i]][zi]!=nil then
      nindex=grid[xi+dirx[i]][yi+diry[i]][zi]
      if nindex!=9 and nindex!=10 then
      	ntiles[xi][yi][zi][nindex]+=1
      end
     end
    end

   end
  end
 end

 for xi,x in pairs(grid) do
  for yi,y in pairs(x) do
   for zi,b in pairs(y) do
    if b!=9 and b!=10 then
     for si,s in pairs(tools[b].syns) do
 	    for ni,n in pairs(ntiles[xi][yi][zi]) do
 			   if s[1]==ni and s[4]==n then
 	      _mpc+=s[2]
 	      _mps+=s[3]
 	      if not s[5] then
 	       s[5]=true
 	       newsyn(s)
 	      end
 	     end
 	    end
 	   end
 			end
   end
  end
 end

 -----------------------

 for bi,ba in pairs(banks) do
  ba.mt-=1
  ba.gt-=1
  if ba.mt<=0 then
   m-=25
   ba.nm+=1
   if ba.nm==3 then
   	ba.mt=30*30
   else
   	ba.mt=15*30
   end
  end
  if ba.gt<=0 then
   m+=ceil(m*(4/100))
   ba.gt=60*30
   ba.nm=0
   ba.mt=15*30
  end
 end

 mpc=_mpc
 mps=_mps

 mt+=1
 if mt>30 then
  mt=0
  m+=mps
 end
end

-- 🅾️
-- ❎
function clicker()
 if cursm==2 then
  if btnp(❎) then
   if canclick❎ then
    isclicking❎=true
    m+=mpc
    addfloat("+"..mpc,115,96)
   end
  else
   isclicking❎=false
  end
  if btnp(🅾️) then
   if canclick🅾️ then
    isclicking🅾️=true
    m+=mpc
    addfloat("+"..mpc,115,96)
   end
  else
   isclicking🅾️=false
  end
 end
 if btn(❎) then
  canclick❎=false
 else
  canclick❎=true
 end
 if btn(🅾️) then
  canclick🅾️=false
 else
  canclick🅾️=true
 end
end

function updatepos()
 pos={
  {{},{},{},{},{}},
  {{},{},{},{},{}},
  {{},{},{},{},{}},
  {{},{},{},{},{}},
  {{},{},{},{},{}}
 }

 local sx=53
 local sy=50
 local x=53
 local y=50
 local sty

 for gi,g in pairs(grid) do
  for ti,t in pairs(g) do
   sty=0
   for i,b in pairs(t) do
    add(pos[gi][ti],{x,y+sty})
 			if t[i+1]==1 then
     sty-=2
    elseif t[i+1]==5 then
     sty-=2
    elseif t[i+1]!=8 then
     sty-=11
    else
     sty-=4
    end
   end
   x+=10
   y+=5
  end
  sx-=10
  sy+=5
  x=sx
  y=sy
 end
end

function updatefocus()
 local b=grid[gridx][gridy]
 if b[focusy]==1 and b[2]!=nil then
  focusy=2
 elseif b[focusy]==8 then
  focusy+=1
 end
 if focusy>#b then
  if b[2]==nil then
   focusy=1
  else
   focusy=2
  end
 end
end

function startrocks()
 local x=flr(rnd(5))+1
 local y=flr(rnd(5))+1
 grid[x][y][2]=rnd()>0.5 and 9 or 10
 local x2=flr(rnd(5))+1
 local y2=flr(rnd(5))+1
 while x==x2 and y==y2 do
  x2=flr(rnd(5))+1
  x2=flr(rnd(5))+1
 end
 grid[x2][y2][2]=rnd()>0.5 and 9 or 10
	local x3=flr(rnd(5))+1
 local y3=flr(rnd(5))+1
 while x==x3 and y==y3 or x2==x3 and y2==y3 do
  x2=flr(rnd(5))+1
  x2=flr(rnd(5))+1
 end
 grid[x3][y3][2]=rnd()>0.5 and 9 or 10
end

function spawnrocks()
 if numbuilds<=7 and numrocks<7 then
	 rt+=1
	 if rt>=20*30 then
	  rt=0
	  local x=flr(rnd(5))+1
	 local y=flr(rnd(5))+1
	 while grid[x][y][2]!=nil do
	  x=flr(rnd(5))+1
	  x=flr(rnd(5))+1
	 end
	 grid[x][y][2]=rnd()>0.5 and 9 or 10
	 end
	end
end
-->8
-- tools

function print2(_txt,_x,_y,_col,_bgcol,_scol)
 if _bgcol!=nil and _scol==nil then
  for x=1,8 do
   for y=1,8 do
    print(_txt,_x+dirx[x],_y+diry[y],_bgcol)
   end
  end
  print(_txt,_x,_y,_col)
 elseif _bgcol==nil and _scol!=nil then
  print(_txt,_x,_y+1,_scol)
  print(_txt,_x,_y,_col)
 elseif _bgcol!=nil and _scol!=nil then
  for sx=-1,1 do
   print(_txt,_x+sx,_y+2,_scol)
  end
  for x=1,8 do
   for y=1,8 do
    print(_txt,_x+dirx[x],_y+diry[y],_bgcol)
   end
  end
  print(_txt,_x,_y,_col)
 else
  print(_txt,_x,_y,_col)
 end
end

function sproutline(_spr,_x,_y,_col,_sx,_sy)
 for i=0,15 do
  pal(i,_col)
 end
 for i=1,8 do
  spr(_spr,_x+dirx[i],_y+diry[i],_sx,_sy)
 end
 pal()
 palt(14,true)
 palt(0,false)
end

function arr(val)
 return val%1>0.5 and ceil(val) or flr(val)
end

-->8
-- ui
function addfloat(_txt,_x,_y)
 add(floats,{txt=_txt,x=_x,y=_y,ty=_y-10,t=0})
end

function updatefloats()
 for f in all(floats) do
  f.y+=(f.ty-f.y)/5
  f.t+=1
  if f.t>20 then
   del(floats,f)
  end
 end
end

function toggle_statsp()
 if showstatsp then
  showstatsp=false
  menuitem(2, "stats+ on", toggle_statsp)
 else
  showstatsp=true
  menuitem(2, "stats+ off", toggle_statsp)
 end
end

function toggle_music()
 if domusic then
  domusic=false
  music(-1)
  menuitem(3, "music on", toggle_music)
 else
  domusic=true
  music(0)
  menuitem(3, "music off", toggle_music)
 end
end

function toggle_sounds()
 if dosounds then
  dosounds=false
  menuitem(4, "sounds on", toggle_sounds)
 else
  dosounds=true
  menuitem(4, "stats+ off", toggle_sounds)
 end
end

---------- corrupt -----------
--[[

 for i=1,5 do
  poke(rnd(0x8000),rnd(0x100))
 end

]]
------------------------------
-->8
-- balance

function updatetools()
 local hotelmpc=-numbuilds/4
 tools={
  {name="delete",
   desc=[[deletes a building.
if buildings are stacked,
deletes the top one.]],
   price=0,
   mpc=0,
   mps=0,
   sp=focus and 33 or 1,
   w=3,
   h=2,
   height=2,
   syns={}},
  {name="housing",
   desc=[[produces 0.5/click and 0/sec
costs 50$]],
   price=50,
   mpc=0.5,
   mps=0,
   sp=4,
   w=3,
   h=3,
   height=11,
   syns={{2,0.25,0,1,false,11},{2,0.5,0,2,false,11},{2,-0.5,0,3,false,8},{2,-0.5,0,4,false,8},{3,0,0,1,false,11},{3,0,0,2,false,11},{3,0,0,3,false,11},{3,0,0,4,false,1},{4,0,0,1,false,11},{4,0,0,2,false,11},{4,0,0,3,false,11},{4,0,0,4,false,11},{5,0,0,1,false,11},{5,0,0,2,false,11},{5,0,0,3,false,11},{5,0,0,4,false,11},{6,0,0,1,false,11},{6,0,0,2,false,11},{6,0,0,3,false,11},{6,0,0,4,false,11}}},
  {name="office",
   desc=[[produces 0/click and 0.5/sec
costs 100$]],
   price=100,
   mpc=0,
   mps=0.5,
   sp=7,
   w=3,
   h=3,
   height=11,
   syns={{3,0,0.25,1,false,11},{3,0,0.5,2,false,11},{3,0,-0.5,3,false,8},{3,0,-0.5,4,false,8},{2,0,0,1,false,11},{2,0,0,2,false,11},{2,0,0,3,false,11},{2,0,0,4,false,1},{4,0,0,1,false,11},{4,0,0,2,false,11},{4,0,0,3,false,11},{4,0,0,4,false,11},{5,0,0,1,false,11},{5,0,0,2,false,11},{5,0,0,3,false,11},{5,0,0,4,false,11},{6,0,0,1,false,11},{6,0,0,2,false,11},{6,0,0,3,false,11},{6,0,0,4,false,11}}},
   {name="coffee shop",
   desc=[[-0.25$/click, +1.5$/sec
costs 200$]],
   price=200,
   mpc=-0.25,
   mps=3,
   sp=10,
   w=3,
   h=3,
   height=11,
   syns={{3,0,0,1,false,11},{3,0,0,2,false,11},{3,0,0,3,false,8},{3,0,0,4,false,8},{2,0,0,1,false,11},{2,0,0,2,false,11},{2,0,0,3,false,11},{2,0,0,4,false,1},{4,0,0,1,false,11},{4,0,0,2,false,11},{4,0,0,3,false,11},{4,0,0,4,false,11},{5,0,0,1,false,11},{5,0,0,2,false,11},{5,0,0,3,false,11},{5,0,0,4,false,11},{6,0,0,1,false,11},{6,0,0,2,false,11},{6,0,0,3,false,11},{6,0,0,4,false,11}}},
   {name="park",
   desc=[[+0.5$/click, +0.5$/sec
cannot be built on top of
costs 250$]],
   price=250,
   mpc=0.5,
   mps=0.5,
   sp=13,
   w=3,
   h=2,
   height=2,
   syns={{5,0.25,0.25,1,false,11},{5,0.5,0.5,2,false,11},{5,0.75,0.75,3,false,11},{5,1,1,4,false,11},{2,0,0,1,false,11},{2,0,0,2,false,11},{2,0,0,3,false,11},{2,0,0,4,false,1},{4,0,0,1,false,11},{4,0,0,2,false,11},{4,0,0,3,false,11},{4,0,0,4,false,11},{3,0,0,1,false,11},{3,0,0,2,false,11},{3,0,0,3,false,11},{3,0,0,4,false,11},{6,0,0,1,false,11},{6,0,0,2,false,11},{6,0,0,3,false,11},{6,0,0,4,false,11}}},
   {name="hotel",
   desc=[[produces 0.125$ per building on
the map
costs 300$]],
   price=300,
   mpc=numbuilds/8,
   mps=0,
   sp=128,
   w=3,
   h=3,
   height=11,
   syns={{6,hotelmpc+numbuilds/10,0,1,false,8},{6,hotelmpc+numbuilds/16,0,2,false,8},{6,hotelmpc+numbuilds/20,0,3,false,8},{6,hotelmpc+numbuilds/20,0,4,false,8},{2,0,0,1,false,11},{2,0,0,2,false,11},{2,0,0,3,false,11},{2,0,0,4,false,1},{4,0,0,1,false,11},{4,0,0,2,false,11},{4,0,0,3,false,11},{4,0,0,4,false,11},{5,0,0,1,false,11},{5,0,0,2,false,11},{5,0,0,3,false,11},{5,0,0,4,false,11},{3,0,0,1,false,11},{3,0,0,2,false,11},{3,0,0,3,false,11},{3,0,0,4,false,11}}},
   {name="bank",
   desc=[[takes 25$ each 15sec, but gives
+4% of total money each minute
costs 400$]],
   price=400,
   mpc=0,
   mps=0,
   sp=131,
   w=3,
   h=3,
   height=11,
   syns={}},
   {name="foundations",
   desc=[[allows you to stack buildings
costs 600$]],
   price=600,
   mpc=0,
   mps=0,
   sp=134,
   w=3,
   h=2,
   height=4,
   syns={}},
   {name="small rock",
   desc=[[]],
   price=0,
   mpc=0,
   mps=0,
   sp=0,
   w=3,
   h=2,
   height=4,
   syns={}},
   {name="big rock",
   desc=[[]],
   price=0,
   mpc=0,
   mps=0,
   sp=0,
   w=3,
   h=2,
   height=4,
   syns={}}
 }
end

function newsyn(syn)

end
__gfx__
00000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeddeeeeeeeeeeeeeeeeeeeeee88eeeeeeeeeeeeeeeeeeeeeeddeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
00000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeddddddeeeeeeeeeeeeeeeeee888888eeeeeeeeeeeeeeeeeeddddddeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
00700700eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeddddddddddeeeeeeeeeeeeee8888888888eeeeeeeeeeeeeeddddddddddeeeeeeeeeeeeeeee3beeeeeeeeeeeeee
00077000eeeeeeeeee33eeeeeeeeeeeeeeeeddddddddddddddeeeeeeeeee88888888888888eeeeeeeeeeddddddddddddddeeeeeeeeeeeee333beeeeeeeeeeeee
00077000eeeeeeee33bb33eeeeeeeeeeeeddddddddddddddddddeeeeee888888888888888888eeeeeeddddddddddddddddddeeeeeeeeeee333beeeeeeeeeeeee
00700700eeeeee33bbbbbb33eeeeeeeeee55dddddddddddddd66eeeeee2288888888888888ffeeeeee33ddddddddddddddbbeeeeeeeeeee333beeeeeeeeeeeee
00000000eeee33bbbbbbbbbb33eeeeeeee5555dddddddddd6666eeeeee22228888888888ffffeeeeee3333ddddddddddbbbbeeeeeeeeeeee4933eeeeeeeeeeee
00000000ee33bbbbbbbbbbbbbb33eeeeee555555dddddd666666eeeeee222222888888ffffffeeeeee333333ddddddbbbbbbeeeeeeeeeeee493333eeeeeeeeee
0000000033bbbbbbbbbbbbbbbbbb33eeee59555555dd666666a6eeeeee2922222288ffffffafeeeeee39333333ddbbbbbbabeeeeeeeeee335433333feeeeeeee
000000005533bbbbbbbbbbbbbb3344eeee55995555566666aa66eeeeee229922222fffffaaffeeeeee339933333bbbbbaabbeeeeeeee333333333ffff9eeeeee
00000000555533bbbbbbbbbb334444eeee555559555666a66666eeeeee222229222fffafffffeeeeee333339333bbbabbbbbeeeeee3333333339ffff3333eeee
00000000ee555533bbbbbb334444eeeeee5955559956aa6666a6eeeeee292222992faaffffafeeeeee393333993baabbbbabeeeeeeee33333fffff3333eeeeee
00000000eeee555533bb334444eeeeeeee55995555566666aa66eeeeee229922222fffffaaffeeeeee339933333bbbbbaabbeeeeeeeeee3fffff3333eeeeeeee
00000000eeeeee5555334444eeeeeeeeee555559555666a66666eeeeee222229222fffafffffeeeeee333339333bbbabbbbbeeeeeeeeeeeef93333eeeeeeeeee
00000000eeeeeeee555444eeeeeeeeeeee5955559956aa6666a6eeeeee292222992faaffffafeeeeee393333993baabbbbabeeeeeeeeeeeeee33eeeeeeeeeeee
00000000eeeeeeeeee54eeeeeeeeeeeeee55995555566666aa66eeeeee229922222fffffaaffeeeeee339933333bbbbbaabbeeeeeeeeeeeeeeeeeeeeeeeeeeee
00000000eeeeeeeeeeeeeeeeeeeeeeeeee555559555666a66666eeeeee222229222fffafffffeeeeee333339333bbbabbbbbeeeeeeeeeeeeeeeeeeeeeeeeeeee
00000000eeeeeeeeeeeeeeeeeeeeeeeeee5955559956aa6666a6eeeeee292222992faaffffafeeeeee393333993baabbbbabeeeeeeeeeeeeeeeeeeeeeeeeeeee
00000000eeeeeeeeeeeeeeeeeeeeeeeeee55995555566666aa66eeeeee229922222fffffaaffeeeeee339933333bbbbbaabbeeee000000000000000000000000
00000000eeeeeeeeee00eeeeeeeeeeeeee555559555666a66666eeeeee222229222fffafffffeeeeee333339333bbbabbbbbeeee000000000000000000000000
00000000eeeeeeee006600eeeeeeeeeeeeee55559956aa6666eeeeeeeeee2222992faaffffeeeeeeeeee3333993baabbbbeeeeee000000000000000000000000
00000000eeeeee0066666600eeeeeeeeeeeeee5555566666eeeeeeeeeeeeee22222fffffeeeeeeeeeeeeee33333bbbbbeeeeeeee000000000000000000000000
00000000eeee00666666666600eeeeeeeeeeeeee555666eeeeeeeeeeeeeeeeee222fffeeeeeeeeeeeeeeeeee333bbbeeeeeeeeee000000000000000000000000
00000000ee006666666666666600eeeeeeeeeeeeee56eeeeeeeeeeeeeeeeeeeeee2feeeeeeeeeeeeeeeeeeeeee3beeeeeeeeeeee000000000000000000000000
000000000066666666666666666600eeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000000000000000000000000000
0000000011006666666666666600ddeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000000000000000000000000000
00000000111100666666666600ddddeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000000000000000000000000000
00000000ee11110066666600ddddeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000000000000000000000000000
00000000eeee1111006600ddddeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000000000000000000000000000
00000000eeeeee111100ddddeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000000000000000000000000000
00000000eeeeeeee111dddeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000000000000000000000000000
00000000eeeeeeeeee1deeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000000000000000000000000000
eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed66666666666666d0aaaaaaaaaaaaaa01dddddddddddddd100000000000000000000000000000000
eeeeeeeee77eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee6dddddddddddddd5a000000000000009d11111111111111000000000000000000000000000000000
eeeeeee77ee77eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee6dddddddddddddd5a000000000000009d1111111111111100000000bb00000000000000bb0000000
eeeee77eeeeee77eeeeeeeeeeeeeeeeeee33eeeeeeeeeeee6dddddddddddddd5a000000000000009d1111111111111100000000bb0000000000000bbbb000000
eee77eeeeeeeeee77eeeeeeeeeeeeeee33bb33eeeeeeeeee6dddddddddddddd5a000000000000009d111111111111110000000bbbb00000000000bbbbbb00000
e77eeeeeeeeeeeeee77eeeeeeeeeee33bbbbbb33eeeeeeee6dddddddddddddd5a000000000000009d111111111111110000000bbbb0000000000bbbbbbbb0000
7eeeeeeeeeeeeeeeeee7eeeeeeee33bbbbbbbbbb33eeeeee6dddddddddddddd5a000000000000009d11111111111111000000bbbbbb00000000bbbbbbbbbb000
e77eeeeeeeeeeeeee77eeeeeee33bbbbbbbbbbbbbb33eeee6dddddddddddddd5a000000000000009d11111111111111000000bbbbbb0000000000bbbbbb00000
eee77eeeeeeeeee77eeeeeee33bbbbbbbbbbbbbbbbbb33ee6dddddddddddddd5a000000000000009d1111111111111100000bbbbbbbb000000000bbbbbb00000
eeeee77eeeeee77eeeeeeeeeee33bbbbbbbbbbbbbb33eeee6dddddddddddddd5a000000000000009d1111111111111100000bbbbbbbb000000000bbbbbb00000
eeeeeee77ee77eeeeeeeeeeeeeee33bbbbbbbbbb33eeeeee6dddddddddddddd5a000000000000009d111111111111110000000bbbb00000000000bbbbbb00000
eeeeeeeee77eeeeeeeeeeeeeeeeeee33bbbbbb33eeeeeeee6dddddddddddddd5a000000000000009d111111111111110000000bbbb00000000000bbbbbb00000
eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee33bb33eeeeeeeeee6dddddddddddddd5a000000000000009d111111111111110000000bbbb00000000000bbbbbb00000
eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee33eeeeeeeeeeee6dddddddddddddd5a000000000000009d11111111111111000000000000000000000000000000000
eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee6dddddddddddddd5a000000000000009d11111111111111000000000000000000000000000000000
eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed55555555555555d0999999999999990100000000000000100000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000088880000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060060000000000000000000000
00008888888800000000000660000000000000666600000000000000000000000000000660000000000000000000000000000666666600000000000bb0000000
0008880000888000000000600600000000000600006000000000000000000000000000066000000000000000000000000000666666660000000000bbbb000000
000880000888800000000600006000000006606666066000006666666666660000000066660000000006000000000000000066000000000000000bbbbbb00000
00880000888088000000600000060000006000000000060000600000000606000000000660000000000606000000000000006600000000000000bbbbbbbb0000
0088000888008800000600000000600000600000000006000060000000060600000006666660000000060666666060000000066666000000000bbbbbbbbbb000
008800888000880000006000000600000060000000000600006000000006600000000066660000000006000000006000000000666660000000000bbbbbb00000
008808880000880000006000000600000060000000000600006000000006000000006666666600000006666666666000000000000066000000000bbbbbb00000
000888800008800000006000000600000060000000000600006000000006000000000666666000000006000000006000000000000066000000000bbbbbb00000
000888000088800000006000000600000060000000000600000600000060000000066606606660000006000000006000000066666666000000000bbbbbb00000
000088888888000000000666666000000006666666666000000066666600000000000006600000000000000000000000000066666660000000000bbbbbb00000
00000088880000000000000000000000000000000000000000000000000000000000000660000000000000000000000000000060060000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001
eeeeeeeeeeaaeeeeeeeeeeeeeeeeeeeeee33eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee777777eeeee0000000000000000000000000000000000000000
eeeeeeeeaaaaaaeeeeeeeeeeeeeeeeee333333eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee7744444477eee0000000000000000000000000000000000000000
eeeeeeaaaaaaaaaaeeeeeeeeeeeeee3333333333eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee7449999999a7ee0000000000000000000000000000000000000000
eeeeaaaaaaaaaaaaaaeeeeeeeeee33333333333333eeeeeeeeeeeeeeeeeeeeeeeeeeeeeee749999999999a7e0000000000000000000000000000000000000000
eeaaaaaaaaaaaaaaaaaaeeeeee333333333333333333eeeeeeeeeeeeee00eeeeeeeeeeeee749999aa9999a7e0000000000000000000000000000000000000000
ee44aaaaaaaaaaaaaa88eeeeee2233333333333333cceeeeeeeeeeee000000eeeeeeeeee749999a9949999a70000000000000000000000000000000000000000
ee4444aaaaaaaaaa8888eeeeee22223333333333cccceeeeeeeeee0000000000eeeeeeee749999a9949999a70000000000000000000000000000000000000000
ee444444aaaaaa888888eeeeee222222333333cccccceeeeeeee00000000000000eeeeee74999a99994999a70000000000000000000000000000000000000000
ee49444444aa888888a8eeeeee2922222233ccccccaceeeeee000000000000000000eeee74999a99994999a70000000000000000000000000000000000000000
ee44994444488888aa88eeeeee229922222cccccaacceeeeeeee00000000000000eeeeee749999a9949999a70000000000000000000000000000000000000000
ee444449444888a88888eeeeee222229222cccaccccceeeeeeeeee0000000000eeeeeeee749999a9949999a70000000000000000000000000000000000000000
ee4944449948aa8888a8eeeeee292222992caaccccaceeeeeeeeeeee000000eeeeeeeeeee799999449999a7e0000000000000000000000000000000000000000
ee44994444488888aa88eeeeee229922222cccccaacceeeeeeeeeeeeee00eeeeeeeeeeeee7a9999999999a7e0000000000000000000000000000000000000000
ee444449444888a88888eeeeee222229222cccaccccceeeeeeeeeeeeeeeeeeeeeeeeeeeeee7aa999999aa7ee0000000000000000000000000000000000000000
ee4944449948aa8888a8eeeeee292222992caaccccaceeeeeeeeeeeeeeeeeeeeeeeeeeeeeee77aaaaaa77eee0000000000000000000000000000000000000000
ee44994444488888aa88eeeeee229922222cccccaacceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee777777eeeee0000000000000000000000000000000000000000
ee444449444888a88888eeeeee222229222cccaccccceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000000000000
ee4944449948aa8888a8eeeeee292222992caaccccaceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee666eeeeeeeeee00000000000000000000000000000000
ee44994444488888aa88eeeeee229922222cccccaacceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee66666eeeeeeeee00000000000000000000000000000000
ee444449444888a88888eeeeee222229222cccaccccceeeeeeeeeeeee663eeeeeeeeeeeeeeeeeeeee6666666eeeeeeee00000000000000000000000000000000
eeee44449948aa8888eeeeeeeeee2222992caacccceeeeeeeeeeeeee556663eeeeeeeeeeeeeeeeee556666666eeeeeee00000000000000000000000000000000
eeeeee4444488888eeeeeeeeeeeeee22222ccccceeeeeeeeeeeeee3555666633eeeeeeeeeeeeee35555566666eeeeeee00000000000000000000000000000000
eeeeeeee444888eeeeeeeeeeeeeeeeee222ccceeeeeeeeeeeeee33b55556666b33eeeeeeeeee33b55555666663eeeeee00000000000000000000000000000000
eeeeeeeeee48eeeeeeeeeeeeeeeeeeeeee2ceeeeeeeeeeeeee33bbb55556666bbb33eeeeee33bbb5555556666633eeee00000000000000000000000000000000
00000000000000000000000000000000000000000000000033bbbbbb5556666bbbbb33ee33bbbbb55555566666bb33ee00000000000000000000000000000000
000000000000000000000000000000000000000000000000ee33bbbbb55566bbbb33eeeeee33bbb5555556666b33eeee00000000000000000000000000000000
000000000000000000000000000000000000000000000000eeee33bbbbbbbbbb33eeeeeeeeee33bb5555566633eeeeee00000000000000000000000000000000
000000000000000000000000000000000000000000000000eeeeee33bbbbbb33eeeeeeeeeeeeee33b5555663eeeeeeee00000000000000000000000000000000
000000000000000000000000000000000000000000000000eeeeeeee33bb33eeeeeeeeeeeeeeeeee33bb33eeeeeeeeee00000000000000000000000000000000
000000000000000000000000000000000000000000000000eeeeeeeeee33eeeeeeeeeeeeeeeeeeeeee33eeeeeeeeeeee00000000000000000000000000000000
000000000000000000000000000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000000000000
000000000000000000000000000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000000000000
__label__
88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
88888eeeeee888eeeeee888eeeeee888eeeeee888eeeeee888eeeeee888777777888888888888888888ff8ff8888228822888222822888888822888888228888
8888ee888ee88ee88eee88ee888ee88ee888ee88ee8e8ee88ee888ee88778777788888888888888888ff888ff888222222888222822888882282888888222888
888eee8e8ee8eeee8eee8eeeee8ee8eeeee8ee8eee8e8ee8eee8eeee87778777788888e88888888888ff888ff888282282888222888888228882888888288888
888eee8e8ee8eeee8eee8eee888ee8eeee88ee8eee888ee8eee888ee8777888778888eee8888888888ff888ff888222222888888222888228882888822288888
888eee8e8ee8eeee8eee8eee8eeee8eeeee8ee8eeeee8ee8eeeee8ee87778787788888e88888888888ff888ff888822228888228222888882282888222288888
888eee888ee8eee888ee8eee888ee8eee888ee8eeeee8ee8eee888ee877788877888888888888888888ff8ff8888828828888228222888888822888222888888
888eeeeeeee8eeeeeeee8eeeeeeee8eeeeeeee8eeeeeeee8eeeeeeee877777777888888888888888888888888888888888888888888888888888888888888888
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555565655555ccc55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556565777555c55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
5555555555555666555555cc55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556565777555c55755555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555565655555ccc57555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556565666566655665656566655555cc55cc555555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555565656555565565556565565577755c555c555555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555566656655565565556665565555555c555c555555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555565656555565565656565565577755c555c555755555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556565666566656665656556555555ccc5ccc57555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555665656566555665555557755775ccc55555ccc55555ccc5ccc55555ccc55555cc555555ccc5ccc5c5555cc5ccc55555cc55cc5577555555577
5555555555555655565656565655577755755575555c55555c5c5555555c5c5555555c5c555555c555555c555c5c5c555c555c55555555c555c5557555555575
55555555555556665666565656665555577557755ccc55555c5c55555ccc5ccc55555c5c555555c555555cc55ccc5c555ccc5cc5555555c555c5557755555775
55555555555555565556565655565777557555755c5555755c5c55555c55555c55755c5c557555c555755c555c5c5c55555c5c55557555c555c5557555755575
55555555555556655666565656655555557755775ccc57555ccc55c55ccc5ccc57555ccc57555ccc57555c555c5c5ccc5cc55ccc57555ccc5ccc577557555577
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555557755555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555755555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555775555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555755575555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555557755755555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555577566556665666566655555c5c55cc5ccc5ccc5ccc55cc5ccc5c5c5555555555555555555555555555555555555555555555555555555555555555
555555555575565656565666565557775c5c5c5c5c555c5555c55c555c555c5c5555555555555555555555555555555555555555555555555555555555555555
5555555557755656566656565665555555555c5c5cc55cc555c55c555cc555555555555555555555555555555555555555555555555555555555555555555555
5555555555755656565656565655577755555c5c5c555c5555c55c555c5555555575555555555555555555555555555555555555555555555555555555555555
5555555555775656565656565666555555555cc55c555c555ccc55cc5ccc55555755555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555566556665566556655555cc55cc55ccc5ccc55cc5cc55c5c55cc5ccc55cc55555ccc555c55cc5c555ccc55cc5c5c55555ccc5cc55cc555555ccc
555555555555565656555655565557775c555c555c5c5c5c5c5c5c5c5c5c5c555c555c5555555c5c55c55c555c5555c55c555c5c55555c5c5c5c5c5c55555c5c
555555555555565656655666565555555c555c555ccc5cc55c5c5c5c5c5c5c555cc55ccc55555c5c55c55c555c5555c55c555cc555555ccc5c5c5c5c55555c5c
555555555555565656555556565557775c555c555c555c5c5c5c5c5c5c5c5c555c55555c55555c5c55c55c555c5555c55c555c5c55555c5c5c5c5c5c55555c5c
555555555555566656665665556655555cc55cc55c555c5c5cc55ccc55cc55cc5ccc5cc555555ccc5c5555cc5ccc5ccc55cc5c5c55555c5c5c5c5ccc55555ccc
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55cc55cc55cc5ccc55cc55555cc55ccc5ccc5ccc55cc55cc55555555555555555555555555555555555555555555555555555555555555555555555555555555
5c555c5c5c5555c55c55555555c55c5c5c5c5cc5555c555c55555555555555555555555555555555555555555555555555555555555555555555555555555555
5c555c5c5ccc55c55ccc555555c55c5c5c5c55cc555c555c55555555555555555555555555555555555555555555555555555555555555555555555555555555
5c555c5c555c55c5555c555555c55c5c5c5c5ccc555c555c55755555555555555555555555555555555555555555555555555555555555555555555555555555
55cc5cc55cc555c55cc555555ccc5ccc5ccc55c555cc55cc57555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
5555555555555666566656665566566655555cc55ccc5ccc55555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556565656556556555655577755c55c5c5c5c55555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556665665556556555665555555c55c5c5c5c55555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556555656556556555655577755c55c5c5c5c55755555555555555555555555555555555555555555555555555555555555555555555555555555
5555555555555655565656665566566655555ccc5ccc5ccc57555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556665666556655555ccc555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556665656565557775c5c555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556565666565555555c5c555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556565655565557775c5c557555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556565655556655555ccc575555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556665666556655555ccc55555ccc5555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556665656565557775c5c55555c555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556565666566655555c5c55555ccc5555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556565655555657775c5c5555555c5575555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556565655566555555ccc55c55ccc5755555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
5555555555555566566655555ccc5555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555565556565777555c5555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555566656665555555c5555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555555656555777555c5575555555555555555555555555555555555555555555555515555555555555555555555555555555555555555555555555
555555555555566556555555555c5755555555555555555555555555555555555555555555555171555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555177155555555555555555555555555555555555555555555555
555555555555565655555ccc55555555555555555555555555555555555555555555555555555177715555555555555555555555555555555555555555555555
55555555555556565777555c55555555555555555555555555555555555555555555555555555177771555555555555555555555555555555555555555555555
5555555555555656555555cc55555555555555555555555555555555555555555555555555555177115555555555555555555555555555555555555555555555
55555555555556665777555c55755555555555555555555555555555555555555555555555555511715555555555555555555555555555555555555555555555
555555555555566655555ccc57555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555565655555ccc55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556565777555c55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
5555555555555666555555cc55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556565777555c55755555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555565655555ccc57555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556565666566655665656566655555cc55cc555555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555565656555565565556565565577755c555c555555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555566656655565565556665565555555c555c555555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555565656555565565656565565577755c555c555755555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555556565666566656665656556555555ccc5ccc57555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555588888555555555555555555555555555555555555555555555555555555555555555
55555555555555665656566555665555557755775ccc55555ccc55555ccc88888ccc5ccc55555cc555555ccc5ccc5c5555cc5ccc55555cc55cc5577555555577
5555555555555655565656565655577755755575555c55555c5c55555c5c8888855c5c55555555c555555c555c5c5c555c555c55555555c555c5557555555575
555555555555566656665656566655555775577555cc55555c5c55555c5c88888ccc5ccc555555c555555cc55ccc5c555ccc5cc5555555c555c5557755555775
5555555555555556555656565556577755755575555c55755c5c55755c5c88888c55555c557555c555755c555c5c5c55555c5c55557555c555c5557555755575
55555555555556655666565656655555557755775ccc57555ccc57555ccc88c88ccc5ccc57555ccc57555c555c5c5ccc5cc55ccc57555ccc5ccc577557555577
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
5555555555555577566556665666566655555c5c55cc55cc5ccc5ccc5ccc5ccc555555cc5c5c55cc5ccc5c5c5555555555555555555555555555555555555555
5555555555555575565656565666565557775c5c5c555c5c5c555c555c555c5555555c555c5c5c5c5c5c5c5c5555555555555555555555555555555555555555
55555555555557755656566656565665555555555c555c5c5cc55cc55cc55cc555555ccc5ccc5c5c5ccc55555555555555555555555555555555555555555555
55555555555555755656565656565655577755555c555c5c5c555c555c555c555555555c5c5c5c5c5c5555555575555555555555555555555555555555555555
555555555555557756565656565656665555555555cc5cc55c555c555ccc5ccc55555cc55c5c5cc55c5555555755555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555566556665566556655555cc55cc555555ccc55555ccc5ccc5ccc555c55cc5c555ccc55cc5c5c5555555555555cc555555ccc5ccc555c55cc5ccc
555555555555565656555655565557775c555c5555555c5c5555555c5c555cc555c55c555c5555c55c555c5c5555555555c555c555555c555cc555c55c555c55
555555555555565656655666565555555c555c555ccc5c5c55555ccc5ccc55cc55c55c555c5555c55c555cc5555555555ccc55c555555ccc55cc55c55ccc5cc5
555555555555565656555556565557775c555c5555555c5c55555c55555c5ccc55c55c555c5555c55c555c5c55c5555555c555c55555555c5ccc55c5555c5c55
555555555555566656665665556655555cc55cc555555ccc55c55ccc5ccc55c55c5555cc5ccc5ccc55cc5c5c5c55555555555ccc55c55ccc55c55c555cc55ccc
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
55cc55cc55cc5ccc55cc55555ccc5ccc5ccc5ccc55cc55cc55555555555555555555555555555555555555555555555555555555555555555555555555555555
5c555c5c5c5555c55c555555555c5c5c5c5c5cc5555c555c55555555555555555555555555555555555555555555555555555555555555555555555555555555
5c555c5c5ccc55c55ccc55555ccc5c5c5c5c55cc555c555c55555555555555555555555555555555555555555555555555555555555555555555555555555555
5c555c5c555c55c5555c55555c555c5c5c5c5ccc555c555c55755555555555555555555555555555555555555555555555555555555555555555555555555555
55cc5cc55cc555c55cc555555ccc5ccc5ccc55c555cc55cc57555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
5555555555555666566656665566566655555ccc5ccc5ccc55555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555565656565565565556555777555c5c5c5c5c55555555555555555555555555555555555555555555555555555555555555555555555555555555
5555555555555666566555655655566555555ccc5c5c5c5c55555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
82888222822882228888828282228882822882228222888888888888888888888888888888888888888882828228828882228882822282288222822288866688
82888828828282888888828282828828882882828882888888888888888888888888888888888888888882828828828888828828828288288282888288888888
82888828828282288888822282828828882882828822888888888888888888888888888888888888888882228828822288828828822288288222822288822288
82888828828282888888888282828828882882828882888888888888888888888888888888888888888888828828828288828828828288288882828888888888
82228222828282228888888282228288822282228222888888888888888888888888888888888888888888828222822288828288822282228882822288822288
88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888

__sfx__
000c0000207501500020750000002f750000002075000000207500000027750260002075021000257501a700207502e7002075000000207502000020750000002775023700257502270023750000002275000000
000c0000081500810008150081000815008100081500810008150081000815008100081500810008150081000815008100081500e100081500d10008150081000f1500a1000d1500a0000b150000000a15008100
000c00001c7501500020750000002f750000002075000000207500000027750260002075021000257501a700207502e7002075000000207502000020750000002775023700257502270023750000002275000000
000c00001e7501500020750000002f750000002075000000207500000027750260002075021000257501a700207502e7002075000000207502000020750000002775023700257502270023750000002275000000
000c0000041500810004150081000415008100041500810004150081000415008100041500810004150081000415008100041500e100041500d10004150081000f1500a1000d150000000b150000000a15008100
000c0000061500810006150081000615008100061500810006150081000615008100061500810006150081000615008100061500e100061500d10006150081000f1500a1000d150000000b150000000a15008100
000c000004650000001e600000001c650000001c6001c6001e6000000004650000001c6501c6000465016600046500000020600046001c650000001c600000002060000000046501b6001c650000000000000000
__music__
01 00010644
00 00010644
00 02040644
02 03050644

