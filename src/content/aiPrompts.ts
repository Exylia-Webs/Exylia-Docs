/**
 * The prompts a server owner copies into their own AI to have an effect written.
 *
 * They are kept here rather than in MDX because a prompt is one long literal
 * string: a fenced block inside MDX would be re-highlighted, re-indented and
 * re-escaped on the way to the clipboard, and what the AI receives has to be
 * exactly what is written here.
 *
 * Everything below is verified against ExyliaLib's sequence compiler and the
 * three plugins' shipped `effects.yml`. Keep it that way — a prompt that
 * invents a parameter produces a file the console rejects line by line.
 */

/** The part of the language every effect uses, whichever plugin plays it. */
const DSL_HEAD = `## The step language

A step is one YAML string: a token in brackets, then what it is drawn with, then parameters
separated by \`;\`.

    '[CIRCLE] NETHERITE_SWORD;as:item;radius:3;points:12;from:0,10,0;ease:in'

A shape line draws DISPLAY ENTITIES when it carries \`as:\`, and PARTICLES when it does not.

    as:item    an item model
    as:block   a block model
    as:head    a player head: a base64 texture, or {killer} / {victim} for a face
    as:text    a line of text
    (nothing)  the particle named at the head of the line

### Shapes

CIRCLE SPHERE DOME CUBE LINE RIBBON SCATTER BEAM SPIRAL DOUBLE_HELIX TORNADO STAR CAGE DISC
VORTEX WAVE CROSS GALAXY TORUS BURST PYRAMID RING_PULSE WINGS ARCH CLAW, plus DISPLAY for a
single object at the anchor.

Each shape's own parameters:

    CIRCLE, SPHERE, DOME    radius points
    BEAM                    height points
    SPIRAL                  height radius turns points
    DOUBLE_HELIX            height radius turns points strands
    TORNADO                 height radius top_radius turns points
    STAR                    radius spikes inner points
    CAGE                    radius height columns points
    DISC                    radius rings points
    VORTEX                  radius turns points
    WAVE                    length amplitude frequency arms angle points
    CROSS                   radius arms angle points
    GALAXY                  radius turns arms points
    TORUS                   radius tube segments tube_segments
    BURST                   radius beams angle points
    PYRAMID                 base height points
    RING_PULSE              radius rings spacing points
    WINGS                   span arch depth dir points
    ARCH                    radius arc dir points
    CLAW                    radius claws spread curve dir drop points
    CUBE                    width points edges
    LINE                    length dir climb points
    RIBBON                  radius points waves amplitude
    SCATTER                 radius height points seed floor
    DISPLAY                 (none)

Every shape also understands:

    y          lifts the whole shape. SPHERE and TORUS sit a block up by default, the rest at zero
    scale      grows or shrinks the geometry itself
    ticks      1 draws the shape in one frame; higher spreads it over frames, so it looks drawn
    interval   seconds between those frames. Defaults to 0.05
    rotate     turns the whole shape, in degrees
    face       turns it to face whoever caused the moment
    color size count   particle lines only. DUST takes color:255,80,0

### Moving a display (any shape drawn with as:)

    life       seconds it exists
    from:x,y,z where it starts, relative to its point
    to:x,y,z   where it ends. rise: is shorthand for a vertical to
    ease       in, out or in_out. ease:in aims a slam, ease:out settles one
    gravity    debris only. It is ADDED to the movement rather than replacing it
    spin       turns, or x,y,z to tumble. axis: picks one axis
    orbit      turns carried around the anchor
    pull       1 reaches the centre; a negative number throws it outwards
    size       one number, or x,y,z for a plate, a pillar or a blade
    size_to    the size it ends at
    vary       how much individual pieces differ from one another
    roll tilt turn   fixed rotation in degrees
    face_out   faces away from the centre
    glow       an outline colour
    light      0 to 15. Use light:15 for anything that must read at night
    model billboard hold   the display's own model, billboard mode and hold time`;

/** A picture or a word out of blocks. A scene uses it; a blow has no room for one. */
const DSL_PIXELS = `### PIXELS — a picture or a word out of blocks

    '[PIXELS] RED_CONCRETE;as:block;word:SLAP;pixel:0.12;face:true;y:2.7;ease:out;life:0.25;size:0.02;size_to:0.12;light:15'

    art        heart heart_big broken_heart star crown skull bolt note cloud trophy ufo moon
               guillotine blade grave portal eye clock rift flag
    word       letters instead of a picture
    pixel      the size of one cell, in blocks
    pick       which characters of the picture this line draws: # body, o outline, w shine,
               y gems. Two lines in two materials colour one picture
    depth      moves it towards whoever it faces
    face:true  turns it to whoever did it, which keeps a word the right way round

Everything under Moving a display applies to it.`;

/** What is left of the language once the shapes are written. */
const DSL_TAIL = `### Repeating any step

    repeat     how many times the line plays
    every      seconds between plays. Defaults to 0.15
    turn_each  degrees added each time, so the copies fan out

### The other tokens

    [DELAY] 0.15                          seconds to wait before the next line
    [PARTICLE] FLAME                      count speed y color size offset:x,y,z block
    [SOUND] NAME;volume;pitch             also volume: pitch:
    [LIGHTNING]                           volume: pitch: — flash, sparks and thunder. No strike,
                                          no fire, no damage
    [EXPLOSION]                           count: y:
    [FIREWORK]                            color: fade: type: trail: flicker: power:
    [BLOCK_BREAK] STONE                   count: y: offset:
    [POTION] speed;100;1                  also duration: amplifier:
    [TITLE] title;subtitle;in;stay;out    times in seconds
    [ACTION_BAR] text
    [MESSAGE] text
    [COMMAND] give {player} …             {player} {world} {x} {y} {z}`;

/** The two steps that leave a body behind. A kill is about one; a blow is not. */
const DSL_BODIES = `    [RAGDOLL] {victim}                    the body itself, choreographed, below
    [NPC] {victim}                        a whole fake player, below

### [NPC] — a body

    '[NPC] {victim};pose:lying;life:2.2;equip:true;face:false'

    (the head)  {victim}, {killer}, or a base64 texture. A player NAME is refused
    pose        lying standing crawling sneaking spinning. lying by default
    pose_to / after   a second pose it collapses into
    move_after  seconds it stands there before anything happens to it
    life        seconds it stays. Defaults to 5
    equip       whether it wears what the victim wore. On by default
    face        whether it turns to face. On by default
    from to over ease gravity turn   how it is thrown or how it falls. over defaults to 0.7
    glow        an outline colour
    hurt        plays the damage flash
    y           lifts it
    spin        degrees a second it keeps turning, for its whole life
    bob bob_every   blocks it rises and falls on a loop, and how long one rise and fall takes
    swing       seconds between arm swings
    scale       how big it is drawn, 1 being player-sized
    hold offhand    a material put in each hand
    pitch       head pitch in degrees, negative being up

It is a display, not an entity: nothing can hit it, loot it or walk into it.

### [RAGDOLL] — the body itself

    '[RAGDOLL] {victim};intact:0.1;detail:2;light:15;then:burst;keys:0.25 crouch ease=anticipate | 0.4 stand up=1.6 flip=~-360 ease=out | 0.35 up=0 ease=bounce'

A player's body with every joint kept — head, torso, two arms, two legs — each wearing the colours
of that player's own skin, choreographed frame by frame.

    (the head)  whose body it is: {victim}; {killer}, a copy of whoever did it, acting the death
                out; or {crowd} with seat:N, the Nth player watching nearby, or a stranger when
                nobody is. Every body faces the killer's side, so at=0,0,2 turn=180 is someone two
                blocks away looking at the victim

keys: is the choreography. Frames are separated by |. Each starts with the seconds it takes to
reach it from the one before — the same numbers the effect's [DELAY] lines add up to — then lists
only what changes. The body starts standing where it died, once intact is over. A frame of 0
seconds is where it starts instead, which is how a second body stands across the room from the very
first tick.

    at=right,up,forward    moves the hips, in blocks; also right= up= forward=
    flip= turn= lean=      turns the whole body: forwards, to its left, to its right
    head= body=            pitch,yaw,roll: nods forward, turns left, tilts right
    arm_r= arm_l= leg_r= leg_l=
                           pitch,yaw,roll: swings forward and up, swings a raised limb outwards,
                           raises it away from the body
    arms= legs=            both sides at once, mirrored
    <joint>_at=out,up,forward   pulls a part off its joint
    size= <joint>_size=    how big the body, or one part of it, is
    shake=                 how hard it trembles, in blocks
    ease=                  in_out (default) in out linear back anticipate elastic bounce snap smooth

Angles are degrees. ~90 adds to where a channel already is, so turn=~360 is one more full turn.
smooth flows through a frame instead of stopping at it, which is what a sway or a path needs.

A bare word is a whole pose, and what follows it in the frame is written on top: stand tpose star
cheer reach zombie hug crouch sit kneel lie prone bow pray dab superman splits float limp fetal
swoon heart arabesque

    then        what happens after the last frame: hold, burst, collapse, implode or dissolve.
                burst reads speed up spread gravity bounce spin; implode reads turns
    then:spell  lays every piece out into the word in sign: (letters: tall, rise: off the floor)
                with the head floating over it, holds, and drops it
    follow      how much the loose joints lag and overshoot. 1 is a body, 2 is a cartoon
    hold offhand hat   an item in a hand or on the head, carried wherever the body goes.
                       hold_size hat_size hat_y size and place them
    strings     puppet strings from the hands and head, up to that height
    chains      shackles both wrists to the floor that far out to each side
    snip        the second the strings or chains break
    intact      seconds the body stands whole before its frames begin
    life        leave it out and the body lives as long as its frames and its finish need
    detail      cells each part is cut into, 1 to 4. 1 is six boxes and the cheapest; 2 keeps a
                sleeve apart from a hand. Shipped effects use 3 for the victim, 2 for anyone else
    size glow light y face   as on any display

The older poses still work — pose:burst spread knocked vortex balloon helicopter plane flatten
melt sign thrown — but write new bodies with keys:. Time whatever lands on the body — the slap, the
anvil, the blade — so its [DELAY] lines add up to the second its frame arrives.`;

/** The three rules, the palette and what a bad line does. */
const DSL_FOOT = `## Three rules that save an afternoon

1. \`ease:in\` aims a slam and \`ease:out\` settles one.
2. \`gravity:\` is ADDED to a movement that already descends, so a fall of eight blocks plus
   gravity goes through the floor. Half of gravity times the life squared is how far it drops.
   Use it on debris only.
3. \`roll:\` aims a blade, not \`tilt:\`. An item model is a flat plate facing south with its tip up
   and to the right, so \`roll:135\` points it down.

## Colour tokens

Colours may be written as hex, or as one of the library's palette tokens, which every server can
recolour at once: {primary} {secondary} {secondary_light} {letters} {letters_black} {error}
{success} {success_light} {info} {info_light} {accent} {neutral} {highlight} {muted} {warning}
{warning_light}. \`name:\` also accepts MiniMessage and gradients.

## When a line is wrong

A step that cannot be read is dropped and reported to the console with the line that caused it —
an unknown token, a particle that does not exist, a shape that produced no points, a parameter the
token does not understand. The rest of the effect still plays. So never invent a parameter or a
shape: only what is listed above exists.`;

/** Everything, for an effect that is a scene. */
const SEQUENCE_DSL = [DSL_HEAD, DSL_PIXELS, `${DSL_TAIL}\n${DSL_BODIES}`, DSL_FOOT].join("\n\n");

/** What fits a single blow: no pictures out of blocks, no bodies left on the floor. */
const HIT_DSL = [DSL_HEAD, DSL_TAIL, DSL_FOOT].join("\n\n");

const OUTPUT_RULES = `## What to answer with

1. One YAML block, ready to paste, indented exactly like the examples — two spaces for the effect
   key, four for its keys, six for the \`- '…'\` steps.
2. Every step in single quotes, on its own line.
3. Only materials, particles and sounds that exist in Minecraft 1.21+ (Bukkit enum spelling).
4. Only the tokens, shapes and parameters listed above. Do not invent any.
5. Under the YAML, a short list of what each step does and what to change to tune it.
6. Answer in the language the user wrote their idea in.`;

/** The prompt for each of the three effect plugins. */
export const AI_PROMPTS = {
  killeffect: `You are writing a kill effect for the Minecraft plugin ExyliaKillEffect (Paper/Folia 1.21+),
which draws effects with display entities — real items and blocks that fall, turn and slam —
animated by each viewer's own client rather than by the server tick. Particles are used the way a
film uses smoke: atmosphere around something solid, never the thing itself.

Read everything below, then write the effect the user asks for at the end.

## Where it goes

\`plugins/ExyliaKillEffect/effects.yml\`, under \`kill_effects:\`. An entry looks like this:

    kill_effects:
      GRIDDY:
        category: meme
        tier: common
        name: "<gradient:#B8FF9E:#59A4FF><bold>HIT THE GRIDDY</bold></gradient>"
        material: NOTE_BLOCK
        description:
          - 'Two bars of the griddy, a spin, a dab, and'
          - 'then {highlight}the whole dance goes everywhere{neutral}.'
        priority: 1
        effects:
          - '[SOUND] BLOCK_NOTE_BLOCK_BIT;0.8;1.0'

    category      which tab it appears under; must be a key declared under categories:
                  the shipped ones are meme, void, cataclysm, lovestruck, cosmic
    tier          how rare it is; must be a key declared under tiers: in config.yml
                  the shipped ones are common, rare, epic, legendary. Omit it and it falls back
                  to the first rarity
    name          what menus and placeholders call it. MiniMessage and gradients work
    material      the item the menu row is drawn with. Defaults to BARRIER
    description   one line, or a list of lines. <nl> also breaks a single line
    priority      where it sits in its tab; lower comes first. Defaults to 999
    effects       the steps, drawn where the victim fell
    weapons       optional, only read while behaviour.mode reads weapons. Accepts item names and
                  the families ANY SWORD AXE TRIDENT MACE BOW CROSSBOW MELEE RANGED

The effect key is the permission: GRIDDY is \`exyliakilleffect.effect.griddy\`.

## The anchor and the budget

\`(0,0,0)\` is where the victim fell. Positive Y is up.

A kill effect is a scene, and it is allowed to be one: the shipped ones run about twenty to thirty
steps, three to five and a half seconds end to end. That is the ceiling, not a target — every line is
a packet per viewer. Every shipped effect opens with a \`[RAGDOLL] {victim}\` line choreographed with
keys:, because what happens to the body is what the effect is about; many add a \`{killer}\` body
that walks in and acts the death out, or \`{crowd}\` bodies that watch and join in. Keep every
[SOUND] volume at 1.0 or below: a louder sound only carries further, and anything above is read as 1.0.

${SEQUENCE_DSL}

## Two effects that ship, in full

    GRIDDY:
      category: meme
      tier: common
      name: "<gradient:#B8FF9E:#59A4FF><bold>HIT THE GRIDDY</bold></gradient>"
      material: NOTE_BLOCK
      description:
        - 'Two bars of the griddy, a spin, a dab, and'
        - 'then {highlight}the whole dance goes everywhere{neutral}.'
      priority: 1
      effects:
        - '[RAGDOLL] {victim};keys:0.18 up=-0.1 body=20 arms=45,0,25 legs=12 head=10 ease=out | 0.22 leg_l=48 leg_r=-16 arm_r=85,0,15 arm_l=-45,0,15 up=0.04 forward=0.15 turn=16 head=-10 body=14 ease=smooth | 0.22 leg_l=-16 leg_r=48 arm_r=-45,0,15 arm_l=85,0,15 up=-0.1 forward=0.3 turn=-16 head=14 body=22 ease=smooth | 0.22 leg_l=48 leg_r=-16 arm_r=85,0,15 arm_l=-45,0,15 up=0.04 forward=0.45 turn=16 head=-10 body=14 ease=smooth | 0.22 leg_l=-16 leg_r=48 arm_r=-45,0,15 arm_l=85,0,15 up=-0.1 forward=0.3 turn=-16 head=14 body=22 ease=smooth | 0.22 leg_l=48 leg_r=-16 arm_r=85,0,15 arm_l=-45,0,15 up=0.04 forward=0.15 turn=16 head=-10 body=14 ease=smooth | 0.22 leg_l=-16 leg_r=48 arm_r=-45,0,15 arm_l=85,0,15 up=-0.1 forward=0 turn=-16 head=14 body=22 ease=smooth | 0.22 leg_l=48 leg_r=-16 arm_r=85,0,15 arm_l=-45,0,15 up=0.04 forward=-0.15 turn=16 head=-10 body=14 ease=smooth | 0.22 leg_l=-16 leg_r=48 arm_r=-45,0,15 arm_l=85,0,15 up=-0.1 forward=0 turn=-16 head=14 body=22 ease=smooth | 0.14 crouch forward=0 turn=0 ease=out | 0.4 stand up=0.75 turn=~360 arms=0,0,60 legs=0,0,10 ease=out | 0.2 dab up=0 ease=in | 0.14 up=-0.08 ease=out | 0.14 up=0 ease=in | 0.4 head=40,-24,-8;intact:0.1;detail:3;light:15;then:burst;speed:2.6;up:5.5;follow:1.1'
        - '[SOUND] BLOCK_NOTE_BLOCK_BIT;0.8;1.0'
        - '[DELAY] 0.28'
        - '[SOUND] BLOCK_NOTE_BLOCK_HAT;0.7;1.3;repeat:8;every:0.22'
        - '[SOUND] BLOCK_NOTE_BLOCK_BASS;0.8;0.8;repeat:4;every:0.44'
        - '[PARTICLE] NOTE;count:2;offset:0.7,0.3,0.7;speed:1.0;y:2.3;repeat:8;every:0.22'
        - '[CIRCLE] LIME_CONCRETE;as:block;radius:1.4;points:8;y:0.04;size:0.32,0.03,0.32;orbit:0.5;life:1.9;light:15;glow:{success}'
        - '[CIRCLE] MAGENTA_CONCRETE;as:block;radius:2.1;points:10;y:0.04;size:0.32,0.03,0.32;orbit:-0.5;life:1.9;light:15;glow:{accent}'
        - '[DELAY] 1.9'
        - '[SOUND] ENTITY_PLAYER_ATTACK_SWEEP;0.7;1.4'
        - '[DELAY] 0.6'
        - '[SOUND] BLOCK_NOTE_BLOCK_PLING;0.9;2.0'
        - '[PARTICLE] CRIT;count:18;offset:0.5,0.5,0.5;speed:0.3;y:1.8'
        - '[DELAY] 0.68'
        - '[SOUND] ENTITY_FIREWORK_ROCKET_BLAST;0.9;1.3'
        - '[SOUND] ENTITY_CHICKEN_EGG;1.0;0.7'
        - '[SCATTER] LIME_CONCRETE;as:block;radius:0.5;points:12;seed:301;from:0,1.1,0;pull:-7;to:0,2.4,0;gravity:9;ease:out;spin:1,1,1;life:1.5;size:0.12;vary:1.0;light:15;glow:{success}'
        - '[SCATTER] MAGENTA_CONCRETE;as:block;radius:0.5;points:12;seed:302;from:0,1.1,0;pull:-7;to:0,2.1,0;gravity:9;ease:out;spin:1,1,1;life:1.5;size:0.12;vary:1.0;light:15;glow:{accent}'
        - '[SCATTER] YELLOW_CONCRETE;as:block;radius:0.5;points:12;seed:303;from:0,1.1,0;pull:-7;to:0,2.6,0;gravity:9;ease:out;spin:1,1,1;life:1.5;size:0.12;vary:1.0;light:15;glow:{highlight}'
        - '[PARTICLE] TOTEM_OF_UNDYING;count:30;offset:0.5,0.6,0.5;speed:0.4;y:1.0'

Read it as a script: the victim hits two bars of the griddy on its own frames while the note sounds
and the two rings of floor tiles keep the beat, then crouches, spins up, dabs and lands; then:burst
throws the pieces out as the confetti goes up. Every \`[DELAY]\` is the length of the movement before it.

    SLAPPED:
      category: meme
      tier: rare
      name: "<gradient:#FFD1DC:#FF6B6B><bold>SLAPPED</bold></gradient>"
      material: LEATHER
      description:
        - 'The killer walks up, winds up, and delivers a'
        - 'slap so hard they {highlight}spin into the dirt{neutral}.'
      priority: 11
      effects:
        - '[RAGDOLL] {victim};keys:0 | 0.2 head=0,-15 arms=0,0,18 ease=smooth | 0.2 head=0,15 arms=0,0,18 ease=smooth | 0.2 head=0,-15 arms=0,0,18 ease=smooth | 0.2 head=0,15 arms=0,0,18 ease=smooth | 0.3 head=-8,0,0 ease=smooth | 0.12 | 0.12 head=0,-75,25 flip=8 lean=20 right=0.3 arms=0,0,60 ease=out | 0.55 star right=1.4 turn=~-540 up=0.5 ease=out | 0.35 lie right=1.7 turn=~-90 ease=in | 0.2 up=-0.46 ease=out | 0.2 up=-0.56 ease=in;intact:0.1;detail:3;light:15;then:burst;speed:2;up:3;follow:1.1;life:3.94'
        - '[RAGDOLL] {killer};keys:0 at=0,0,2.4 turn=180 ease=snap | 0.2 forward=2.00 leg_r=30 leg_l=-20 arm_r=-25,0,8 arm_l=25,0,8  ease=smooth | 0.2 forward=1.60 leg_r=-30 leg_l=20 arm_r=25,0,8 arm_l=-25,0,8  ease=smooth | 0.2 forward=1.20 leg_r=30 leg_l=-20 arm_r=-25,0,8 arm_l=25,0,8  ease=smooth | 0.2 forward=0.80 leg_r=-30 leg_l=20 arm_r=25,0,8 arm_l=-25,0,8  ease=smooth | 0.3 legs=0 arm_r=-50,0,95 arm_l=10,0,20 lean=-12 turn=~-25 body=-10 ease=out | 0.12 arm_r=70,-100,85 lean=10 turn=~55 body=10 ease=linear | 0.12 arm_r=40,-60,60 ease=out | 0.55 stand arm_r=0,0,20 head=-10 ease=in_out | 0.35 arms=30,-40,0 ease=smooth | 0.2 arms=40,-20,0 ease=smooth | 0.2 arms=0,0,10;intact:0.1;detail:2;light:15;then:hold;follow:1.0;life:3.94'
        - '[DELAY] 0.1'
        - '[SOUND] BLOCK_GRAVEL_STEP;0.6;1.0;repeat:4;every:0.2'
        - '[DELAY] 0.8'
        - '[SOUND] ENTITY_PLAYER_ATTACK_SWEEP;0.6;1.6'
        - '[DELAY] 0.42'
        - '[SOUND] ENTITY_PLAYER_ATTACK_KNOCKBACK;1.0;1.6'
        - '[SOUND] BLOCK_NOTE_BLOCK_SNARE;1.0;1.4'
        - '[PARTICLE] CRIT;count:24;offset:0.3,0.3,0.3;speed:0.4;y:1.7'
        - '[PARTICLE] SWEEP_ATTACK;count:1;y:1.7'
        - '[PIXELS] RED_CONCRETE;as:block;word:SLAP;pixel:0.12;face:true;y:2.7;ease:out;life:0.25;size:0.02;size_to:0.12;light:15'
        - '[DELAY] 0.12'
        - '[SOUND] ENTITY_BREEZE_WIND_BURST;0.6;1.6'
        - '[DELAY] 0.13'
        - '[PIXELS] RED_CONCRETE;as:block;word:SLAP;pixel:0.12;face:true;y:2.7;from:0,0,0;to:0,0.4,0;ease:in;life:0.8;size:0.12;size_to:0.02;light:15'
        - '[DELAY] 0.77'
        - '[SOUND] ENTITY_PLAYER_BIG_FALL;0.8;1.0'
        - '[PARTICLE] CLOUD;count:14;offset:1.2,0.1,1.2;speed:0.03;y:0.2'
        - '[DELAY] 0.4'
        - '[SOUND] ENTITY_CHICKEN_EGG;0.9;0.8'
        - '[SOUND] BLOCK_NOTE_BLOCK_DIDGERIDOO;0.8;0.7'
        - '[PIXELS] WHITE_CONCRETE;as:block;word:REKT;pixel:0.12;face:true;y:2.4;ease:out;life:0.25;size:0.02;size_to:0.12;light:15'
        - '[DELAY] 0.25'
        - '[PIXELS] WHITE_CONCRETE;as:block;word:REKT;pixel:0.12;face:true;y:2.4;from:0,0,0;to:0,0.4,0;ease:in;life:0.9;size:0.12;size_to:0.02;light:15'

Two bodies from the first tick: the killer's copy starts 2.4 blocks away (at=0,0,2.4 turn=180),
walks up in four steps and winds up while the victim sways on the spot. The victim stands whole for
intact:0.1, and the frame that snaps its head round begins 1.22 seconds into its frames — 1.32 in all,
exactly where the [DELAY] lines put the slap's sound. Then it spins into the dirt, SLAP and REKT grow
in and float away as [PIXELS], and the killer holds its last pose.
`,

  hiteffect: `You are writing a hit effect for the Minecraft plugin ExyliaHitEffect (Paper/Folia 1.21+),
which draws effects with display entities — real items and blocks that fall, turn and slam —
animated by each viewer's own client rather than by the server tick. Particles are used the way a
film uses smoke: atmosphere around something solid, never the thing itself.

Read everything below, then write the effect the user asks for at the end.

## Where it goes

\`plugins/ExyliaHitEffect/effects.yml\`, under \`hit_effects:\`. An entry looks like this:

    hit_effects:
      CRIT_SPARK:
        category: impact
        tier: common
        name: "<gradient:#FFE9A8:#D1A53F><bold>CRIT SPARK</bold></gradient>"
        material: GOLDEN_SWORD
        description: "Eight splinters of gold, {highlight}gone in a third<nl>of a second{neutral}."
        priority: 1
        effects:
          - '[SOUND] ENTITY_PLAYER_ATTACK_CRIT;0.7;1.4'

    category      which tab it appears under; must be a key declared under categories:
                  the shipped ones are impact, crimson, ember, sculk, prism, goofy
    tier          how rare it is; must be a key declared under tiers: in config.yml
                  the shipped ones are common, rare, epic, legendary. Omit it and it is common
    name          what menus and placeholders call it. MiniMessage and gradients work
    material      the item the menu row is drawn with. Defaults to BARRIER
    description   one line, or a list of lines. <nl> also breaks a single line
    priority      where it sits in its tab; lower comes first. Defaults to 999
    effects       the steps, drawn on whoever was hit
    weapons       optional, only read while behaviour.mode reads weapons. Accepts item names and
                  the families ANY SWORD AXE TRIDENT MACE BOW CROSSBOW MELEE RANGED

The effect key is the permission: CRIT_SPARK is \`exyliahiteffect.effect.crit_spark\`.

## The anchor and the budget — read this twice

\`(0,0,0)\` is a block above the victim, so an effect lands on the body rather than at their feet.
Positive Y is up.

A hit effect plays on EVERY BLOW OF EVERY FIGHT, not once per kill. Every line is a packet per
viewer, multiplied by every swing on the server. The shipped effects are TWO TO FIVE STEPS and
UNDER SIX TENTHS OF A SECOND end to end. That is the budget, not a coincidence: keep radii under
about 0.5, sizes small, \`life\` at 0.2–0.5, and use at most one sound. Anything longer reads as lag,
not as an effect.

${HIT_DSL}

## Three effects that ship, in full

    CRIT_SPARK:
      category: impact
      name: "<gradient:#FFE9A8:#D1A53F><bold>CRIT SPARK</bold></gradient>"
      material: GOLDEN_SWORD
      description: "Eight splinters of gold, {highlight}gone in a third<nl>of a second{neutral}."
      priority: 1
      effects:
        - '[SOUND] ENTITY_PLAYER_ATTACK_CRIT;0.7;1.4'
        - '[SPHERE] GOLD_BLOCK;as:block;radius:0.25;points:8;size:0.14;size_to:0.02;pull:-4;ease:out;life:0.32;spin:1,1,1;vary:0.6;light:15;glow:{highlight}'
        - '[PARTICLE] CRIT;count:12;offset:0.3,0.3,0.3;speed:0.15'

    SHATTER:
      category: impact
      name: "<gradient:#E0E0E0:#8A8A8A><bold>SHATTER</bold></gradient>"
      material: STONE
      description: "Stone comes off them and {highlight}falls{neutral}."
      priority: 2
      effects:
        - '[SOUND] BLOCK_STONE_BREAK;0.8;1.5'
        - '[SCATTER] COBBLESTONE;as:block;radius:0.35;points:9;seed:3;height:0.5;size:0.13;size_to:0.02;vary:0.9;pull:-3.5;to:0,0.5,0;gravity:6;ease:out;spin:1,1,1;life:0.45;light:12'

    CLEAVE:
      category: impact
      name: "<gradient:#F0F4F8:#7C93B0><bold>CLEAVE</bold></gradient>"
      material: IRON_SWORD
      description: "One blade passes through, {highlight}edge on{neutral}."
      priority: 4
      effects:
        - '[SOUND] ENTITY_PLAYER_ATTACK_SWEEP;0.8;1.2'
        - '[DISPLAY] IRON_SWORD;from:-2.2,0.4,0;to:2.2,-0.4,0;ease:in_out;life:0.3;size:2.0;roll:225;light:15'
        - '[LINE] DUST;length:4.0;dir:270;points:16;y:0.0;color:{letters};size:1.2;ticks:4;interval:0.02'

Read them as one gesture each: a sound, one solid thing that moves and shrinks, and a particle line
for the light around it. That is the whole shape of a good hit effect.
`,

  arrows: `You are writing an arrow effect for the Minecraft plugin ExyliaArrows (Paper/Folia 1.21+),
which draws effects with display entities — real items and blocks that turn, fall and grow —
animated by each viewer's own client rather than by the server tick. Particles give an effect light
and smoke; displays give it weight and silhouette. Every moment of every shipped effect puts at
least one display on screen: a trail made of particles alone is a smoke line, the same trail with
two spinning chips of ice in it is an arrow made of ice.

Read everything below, then write the effect the user asks for at the end.

## Where it goes

\`plugins/ExyliaArrows/effects.yml\`, under \`arrow_effects:\`. An entry's \`effects\` block is a MAP OF
TRIGGERS, not a list:

    arrow_effects:
      EMBER_TRAIL:
        category: ember
        name: "<gradient:#FFD08A:#C43A10><bold>EMBER TRAIL</bold></gradient>"
        material: BLAZE_ROD
        description: "Coals come off the shaft, {highlight}tumble, and burn out{neutral} behind it."
        priority: 1
        trail-interval: 1
        effects:
          trail:
            - '[PARTICLE] FLAME;count:2;offset:0.04,0.04,0.04;speed:0.01'
          hit:
            - '[SOUND] BLOCK_FIRE_EXTINGUISH;0.7;1.3'

    category        which tab it appears under; must be a key declared under categories:
                      the shipped ones are ember, frost, storm, void, prism, goofy
    name            what menus and placeholders call it. MiniMessage and gradients work
    material        the item the menu row is drawn with
    description     one line, or a list of lines. <nl> also breaks a single line
    priority        where it sits in its tab; lower comes first
    trail-interval  ticks between trail steps. 1 is every tick, 2 every other
    effects         the triggers, below
    bows            optional, only read while behaviour.mode reads bows. Accepts item names and
                    the families ANY BOW CROSSBOW TRIDENT RANGED
    projectiles     optional. Which projectiles it plays on; without it config.yml decides

The effect key is the permission: EMBER_TRAIL is \`exyliarrows.effect.ember_trail\`.

## The five triggers

    launch       the shot leaving the bow. Optional, short, quiet
    trail        along the flight, every trail-interval ticks
    hit          wherever it lands, whatever it hit
    hit-entity   only on something alive — falls back to hit
    hit-block    only on a block — falls back to hit

\`hit-entity\` and \`hit-block\` are the same moment told apart: declare them only when landing on a
player and landing on the ground deserve different pictures. Either spelling is read, \`hit-entity\`
or \`hit_entity\`; write the hyphen, because that is what every other Exylia file writes.

## The anchor and the budget — read this twice

\`(0,0,0)\` is the moment's own anchor: the bow for a launch, the projectile for a trail step, the
point of impact for a hit. Positive Y is up.

The TRAIL is the one with a budget. An arrow lives about forty ticks, and four archers are four
arrows in the air, so whatever \`trail\` writes is drawn on every one of those ticks, per shot: ONE OR
TWO SMALL DISPLAYS plus a particle line for the glow, sizes around 0.07–0.2, \`life\` around 0.4, and
NO SOUND.

The HIT is the payoff and is allowed to be one: under a second, a dozen displays at the very most,
one or two sounds between volume 0.5 and 0.9.

${SEQUENCE_DSL}

## Two effects that ship, in full

    EMBER_TRAIL:
      category: ember
      name: "<gradient:#FFD08A:#C43A10><bold>EMBER TRAIL</bold></gradient>"
      material: BLAZE_ROD
      description: "Coals come off the shaft, {highlight}tumble, and burn out{neutral} behind it."
      priority: 1
      trail-interval: 1
      effects:
        trail:
          - '[DISPLAY] MAGMA_BLOCK;as:block;size:0.09;size_to:0.01;life:0.45;spin:1,1,1;gravity:2;light:15;glow:{warning}'
          - '[PARTICLE] FLAME;count:2;offset:0.04,0.04,0.04;speed:0.01'
        hit:
          - '[SOUND] BLOCK_FIRE_EXTINGUISH;0.7;1.3'
          - '[CIRCLE] MAGMA_BLOCK;as:block;radius:0.2;points:10;size:0.1,0.05,0.1;size_to:0.5,0.04,0.5;pull:-2;ease:out;life:0.45;y:0.05;light:15;glow:{warning}'
          - '[SCATTER] NETHERRACK;as:block;radius:0.35;points:6;seed:11;height:0.4;size:0.09;size_to:0.02;vary:0.8;pull:-3;to:0,0.5,0;gravity:6;ease:out;life:0.5;spin:1,1,1;light:14'
          - '[PARTICLE] FLAME;count:14;offset:0.4,0.2,0.4;speed:0.05'

    CINDERFALL:
      category: ember
      name: "<gradient:#FFC97A:#A03A08><bold>CINDERFALL</bold></gradient>"
      material: CAMPFIRE
      description: "Embers drop out of the flight path and {highlight}keep falling{neutral} after it passes."
      priority: 3
      trail-interval: 1
      effects:
        trail:
          - '[DISPLAY] MAGMA_BLOCK;as:block;size:0.07;size_to:0.01;to:0,-0.9,0;gravity:4;ease:in;life:0.55;spin:1,1,1;light:15'
          - '[PARTICLE] SMALL_FLAME;count:1;offset:0.05,0.05,0.05'
        hit:
          - '[SOUND] BLOCK_CAMPFIRE_CRACKLE;0.8;1.4'
          - '[SCATTER] MAGMA_BLOCK;as:block;radius:0.4;points:9;seed:11;height:0.6;size:0.1;size_to:0.02;vary:0.9;pull:-3;to:0,0.7,0;gravity:6;ease:out;life:0.6;spin:1,1,1;light:15'
          - '[CIRCLE] BLACKSTONE;as:block;radius:0.1;points:8;size:0.06,0.03,0.06;size_to:0.4,0.03,0.4;pull:-2;ease:out;life:0.45;y:0.04;light:10'
          - '[PARTICLE] SMALL_FLAME;count:12;offset:0.4,0.3,0.4;speed:0.03'
`,
} as const;

export type PromptId = keyof typeof AI_PROMPTS;

/**
 * Every prompt ends with the rules, then the idea the owner typed on the page.
 *
 * With no idea written it keeps the marker, so the text stays usable for
 * anyone who copies it and fills the idea in inside their own AI.
 */
export function promptText(id: PromptId, idea = ""): string {
  return `${AI_PROMPTS[id]}${OUTPUT_RULES}

Write the effect for this idea, and ask me before guessing if anything about it is unclear:

${idea.trim() || "<<< WRITE YOUR IDEA HERE >>>"}
`;
}
