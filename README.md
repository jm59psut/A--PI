# Corona JS Hack
> Fully working Dota 2 Script (Free and Opensource API)
<img src="https://i.imgur.com/9Lgj8AF.png">

Fully implemented JS API for Dota 2 for Windows Platform


## Installation

Windows:

```
1)You need to install Node.js first
2)Extract the zip file somewhere like on your Desktop
3)Copy the folder called corona and put it in your DOta 2 Steam game folder, example: C:Program File\Steam\steamapps\common\dota 2 beta\game
4)Make sure the vpk is on the latest version with Dota 2 (if depricated dota 2 will crash with hud error)
5)Build the scripts pressing Build.bat
6)After Building Scripts execute start.bat (should look like this bellow)
7)Put "__init.js" in Menu folder located in src_compiled\Menu (you can find __init.js in the folder that you extracted)
```

<img src="https://i.imgur.com/0uXViww.png">
<img src="https://i.imgur.com/siQyYnT.png">

```
8)Open Dota 2 Match and Enjoy!
```
## Usage example

Make Sure that the Dota 2 Terminal is Open, Type in "bind Home __TogglePannel"

You can write more commands like this just press _ in Terminal and it will show all the avaibvle and implemented API commands and scripts

## GUI
This is the look of the Script when loaded:

<img src="https://i.imgur.com/5c5tRx0.png">


The GUI is very limited (it has only on/off button), only just a list of toggleable scripts

## Developing New Scripts
You will need Visual Studio Code or other Text Editor
To Develop New Scripts just open the folder src from the fodler and start writing new body.ts file inside
another folder for example src/testscript/body.ts
After developing just rerun build.bat
and restart the script.
## Script List
*Tower Range
*TrueSight Detector
*Ability Range
*Ability Range type 2
*ANTI AFK
*AntiInitiation
*AntiInitiation 2
*AutoArmlet (doesn't work for now)
*Auto Deward (after newest update its broken)
*Auto Bottle
*Dazzle AutoGrave (Too much lag probably some minor issue DO NOT USE)
*AutoPhase Boots
*Auto Steal
*Auto Unagro
*Chat spammer
*Blink Range
*FOW Fix (this file is patched by valve so will not work with patching some DLL's
*Enemy ManaBars
*Exp Rsange
*Ez Procast
*Ez Sunstrike
*Ez Techies Auto (Auto using of remote mines and force staff)
*EZ Visage (saves fammiliar if low health)
*Item Panel
*Jungle Maphack
*lasthutMarker
*Wardbuytroll
*WK abuse
*many more...



## Release History

* 0.2.0
    * First Stable and Open Sourced Release

## Meta


Distributed under the GNU GPL v3 license. See ``LICENSE`` for more information.


## Contributing

1. Fork it (<https://github.com/snajdovski/Dota-2-Hacks-Open-Source-JS-API-/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request


