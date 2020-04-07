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
4)Edit gameinfo.gi (inside dota folder)
add this line inside Serach Paths like this:
SearchPaths
		{
			// These are optional language paths. They must be mounted first, which is why there are first in the list.
			// *LANGUAGE* will be replaced with the actual language name. If not running a specific language, these paths will not be mounted
			Game_Language		dota_*LANGUAGE*

			// These are optional low-violence paths. They will only get mounted if you're in a low-violence mode.
			Game_LowViolence	dota_lv
					
			Game				corona
			
				
			Game				dota
			Game				core

			Mod					dota

			AddonRoot			dota_addons

			// Note: addon content is included in publiccontent by default.
			PublicContent		dota_core
			PublicContent		core
		}
Make sure the vpk is on the latest version with Dota 2 (if depricated dota 2 will crash with hud error)
5)Build the scripts pressing Build.bat
6)After Building Scripts execute start.bat (should look like this bellow)
```

<img src="https://i.imgur.com/0uXViww.png">
<img src="https://i.imgur.com/siQyYnT.png">

```
7)Open Dota 2 DEMO Match and Enjoy!
```
## Usage example

Make Sure that the Dota 2 Terminal is Open, Type in "bind Home __TogglePannel"

You can write more commands like this just press _ in Terminal and it will show all the available and implemented API commands and scripts

## GUI
This is the look of the Script when loaded:

<img src="https://i.imgur.com/5c5tRx0.png">


The GUI is very limited (it has only on/off button), only just a list of toggleable scripts
There is also Output log that informs about the script state

## Developing New Scripts
You will need Visual Studio Code or other Text Editor
To Develop New Scripts:
1)Open the folder src in Visual Studio Code
2)Start writing new body.ts file inside another folder for example src/testscript/body.ts
After developing just rerun build.bat
and start.bat
## Script List
```
1)Tower Range
2)TrueSight Detector
3)Ability Range
4)Ability Range type 2
5)ANTI AFK
6)AntiInitiation
7)AntiInitiation 2
8)AutoArmlet (doesn't work for now)
9)Auto Deward (after newest update its broken)
10)Auto Bottle
11)Dazzle AutoGrave (Too much lag probably some minor issue DO NOT USE)
12)AutoPhase Boots
13)Auto Steal
14)Auto Unagro
15)Chat spammer
16)Blink Range
17)Oracle Auto Save (same as Dazzle auto save DO NOT USE IT UNSTABLE)
18)FOW Fix (this file is patched by valve so will not work with patching some DLL's
19)Enemy ManaBars
20)Exp Rsange
21)Ez Procast
22)Ez Sunstrike
23)Ez Techies Auto (Auto using of remote mines and force staff)
24)EZ Visage (saves fammiliar if low health)
25)Item Panel
26)Jungle Maphack
27)lasthutMarker
28)Wardbuytroll
29)WK abuse
30)Skill Alert
*many more...
```
## FAQ
```
Q:I don't see the script menu
A:Make sure that gameinfo.gi points to the corona folder

Q:My game lags when I enable all the scripts
A:The scripts are not optimised for using them all of them at once, this includes Antiinitiation,AutoSteal,JugleMaphack,Last Hit.

Q:I see hud error, what can I do to fix it?

A:Download Dota 2 Workshop Tools and rebuild the hud_reborn file.
1)Download GCFScape
2)Open pak-1_dir.vpk
3)Copy root/panorama/layout/hud/hud_reborn.vxml_c file
4)Open it with notepad++
5)Copy the contents inside script tags (FunctionInit())
6)Download new hud_reborn.xml file from github tracker for dota 2 and rebuild it with Workshop Tools
7)Rebuild the vpk file with vpk.exe builder (Serch it around google)
8)Replace the vpk
9)Start the scripts and dota 2
10)DONE

```

## Release History

* 0.2.0
    * First Stable and Open Sourced Release

## Meta


Distributed under the GNU GPL v3 license. See ``LICENSE`` for more information.

## Credits
To me as an Author and other people from the community

## Compatability
This script should be compatable with other script logic written in JS.

## Contributing

1. Fork it (<https://github.com/snajdovski/Dota-2-Hacks-Open-Source-JS-API-/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request


