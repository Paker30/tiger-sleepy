# tiger-sleepy

Back-end that has two endpoints:
- `/video/{dirPath*}`: Returns all the films in a path, by defaults it returns the films at its base root
- `/action/{action}/video/{video*}`: Execute an action (play, stop) on a film (only works if [omxplayer](https://www.raspberrypi.org/documentation/raspbian/applications/omxplayer.md) is installed
