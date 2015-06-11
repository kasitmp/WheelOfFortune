# WheelOfFortune
A little fun project for making decisions

### How to use

```
var params = {user1: 'option1', user2: 'option2, user3: 'option3'};
var speed = Math.random() * 900 + 100; // variations possible
var wheel = Wheel(params);
wheel.setAcceleration(speed);
wheel.start();
```

With my (dirty) index file you can start it just by url parameters:
`?user1=option1&user2=option2&user3=option3&speed=500`
