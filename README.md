# Hard Game 2048

This version is more hard than the usual `Game 2048`.

### judge algorithm

 * It iterates all directions can be moved in next operation.

 * Then judge the difference between the value adjoin by `log2(x)` and add all differences up,called this `situation hard level`.

 * Finally,pick the direction which has smallest `situation hard level` and choose a position with a number which has biggest `situation hard level` to generate new number.

> It worth to notice that the border squre value can't be judged,and the blank square be considered as `2`.For normal value if they are `2` or `4`,put it the defference with the blank is `0`.

Usually,when `situation hard level` come up around `24~28`,it turns out that game is going over immediately.

The newest version is on [sinaapp](http://weidwonder.github.io/Hard-Game-2048/)
