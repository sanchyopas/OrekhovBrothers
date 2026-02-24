/*
Consultation 4 - Классы, прототипы

🎯 Цели консультации:
  1. Закрепление и углубление теоретических знаний по темам: классы и прототипы в JS;
  2. Развитие практических навыков проектирования и использования объектов, наследования и расширения функционала.
🤔 Части:
  1. Классы (Classes):
 - Способы создания объектов;
 - Прототипное насследование;
 - constructor;
 - _ _proto_ _ и prototype;
 - методы getOwnPropertyDescriptor, hasOwnProperty, getPrototypeOf, Object.defineProperty;
 - Объявление классов; 
 - Конструктор (constructor); 🚩
 - Статические и приватные методы/поля;
 - getter и setter;
  2. Насcледование: 
 - Ключевое слово extends;
 - Вызов родительского конструктора через super();
 - Статические и приватные методы/поля в наследовании;
  3. Потеря контекста в классах: основные причины и способы устранения.
  4. Использование классов для создания связанных списков, деревьев и граф. 🚩

*/

/* 📌Задача 1.3  Что будет выведено в консоле? */
// function Animal(type) {
//   this.type = type;
// }

// console.log(Animal.prototype) //{}

// Animal.prototype.makeSound = function() {
//   console.log(`${this.type} makes a sound`);
// };

// const cat = new Animal("Cat");
// cat.makeSound(); //cat makes a sound 

// console.log(cat) //Animal{type: 'cat'}

// console.log(Animal.prototype) //{makeSound: Function}
// console.log(cat.__proto__) //{makeSound: Function}

// console.log(cat.constructor) //Function Animal
// console.log(Animal.prototype.constructor) //Function Animal

// console.log(Animal.constructor) //Function Function
// //
// console.log(Animal instanceof Function) //true
// //O☀️

// class User {
//     constructor(name){
//         this.name = name
//     }
// }
// const user1 =  new User('Irina')
// console.log(user1) //User { name: 'Irina' }
// console.log(user1.constructor) //[class User]

/* 📌Задача 1.4 Что будет выведено в консоле? Если ошибка, то почини */
// function Person1(name) {
//   this.name = name;
// }

// let juan = new Person1("Juan"); // Person {name: "Juan"}

// Person1.prototype = {
//   getName: function () {
//     return this.name;
//   },
// };
// juan.__proto__ = Person1.prototype
// //console.log(typeof Person1.prototype) //object
// //const pedro = new Person1("Pedro");

// //console.log(pedro.getName());// Pedro
// console.log(juan.getName());//Juan
// //P☀️☀️

// function Person2(name) {
//   this.name = name;
// }

// Person2.prototype = {
//   getName: function () {
//     return this.name;
//   },
// };

// const juan = new Person2("Juan"); 
// const pedro = new Person2("Pedro");

// console.log(pedro.getName());// Pedro
// console.log(juan.getName());// Juan


/* 📌Задача 1.5 Что будет выведено в консоле?
Если ошибка, то почини */
// function UserCreater(name){
//     this.name = name
//     //console.log(this) //UserCreater { name: 'Zmiter' }
// }

// const me = new UserCreater('Zmiter') // UserCreater {name: Zmiter }
// //console.log(me) //UserCreater { name: 'Zmiter' }
// UserCreater.prototype.getName = function(){
//     return hey i am ${this.name}
// } 

// console.log(UserCreater.prototype) // { getName: Function }
// console.log(me) //? UserCreater { name: 'Zmiter' }
// console.log(typeof me, me.getName()) // obj hey i am Zmiter


/*
🔻getOwnPropertyDescriptor - это cтатический метод, который возвращает объект, 
описывающий конфигурацию конкретного свойства заданного объекта (свойства, 
непосредственно присутствующего в объекте, а не в цепочке прототипов). 
Возвращаемый объект является изменяемым, но его изменение не влияет на исходную конфигурацию 
свойства.

Сигнатура: 
const desc = Object.getOwnPropertyDescriptor(obj, 'prop');
где

Принимаемые параметры:
 - obj — обязательный параметр: объект, в котором следует искать данное свойство; 
 - prop — обязательный параметр: название свойства или Symbol, описание которого необходимо 
 получить.
 
 Возвращаемое значение - undefined или объект desc:
  - undefined, если свойство не существует или находится в цепочке прототипов;
  - desc (дескриптор или описание) свойства в виде объекта, возвращает объект при условии, 
  что указанное свойство prop существует в объекте. 
     desc  имеет следующие свойства для обычных свойств:
     - value — значение, связанное с данным свойством;
     - writable — true только если значение свойства можно изменить;
     - configurable — true только если тип дескриптора можно изменить и свойство можно удалить;
     - enumerable — true только если свойство отображается при перечислении (т.е. свойство 
     видно в циклах for...in, Object.keys());

*/
//const obj1 = { foo: 42 }
// obj1.foo = 43
// const desc1 = Object.getOwnPropertyDescriptor(obj1, 'foo')
// console.log(desc1)
/*
{ value: 42, writable: true, enumerable: true, configurable: true }
*/
// for(let key in obj1){
//     console.log(key) //foo
// }

/*
🔻desc имеет следующие свойства для get и set:
     - get — функция-геттер или undefined, если геттера нет;
     - set — функция-сеттер или undefined, если сеттера нет;
     - configurable — true только если тип дескриптора можно изменить и свойство можно удалить;
     - enumerable — true только если свойство отображается при перечислении.
*/

// const obj2 = {
//   get bar() {
//     return 17;
//   }
// };
// const desc2 = Object.getOwnPropertyDescriptor(obj2, "bar"); 
// console.log(desc2) 
/*
{
  get: [Function: get bar],
  set: undefined,
  enumerable: true,
  configurable: true
}
*/


/*
🔻hasOwnProperty - метод экземпляров Object, который возвращает логическое значение, указывающее, 
имеет ли данный объект указанное свойство в качестве собственного свойства (в отличие от 
наследования через цепочку прототипов).

Сигнатура: 
const result = obj.hasOwnProperty('prop');
где
obj - объект, на котором вызывается метод 

Принимаемые параметры:
 - prop — обязательный параметр: название свойства (строка) или Symbol, которое необходимо проверить.

Возвращаемое значение - result:
  - true - если объект имеет указанное свойство в качестве собственного свойства (даже если 
  значение равно null или undefined);
  - false - если свойство наследуется или вообще не объявлено. 
*/

// const obj1 = { }
// obj1.foo = 42
// console.log(obj1.hasOwnProperty('foo')) //true
// console.log(obj1.hasOwnProperty('toString')) //false
// console.log('toString' in obj1) //true

/*
🔻 Object.getPrototypeOf() - статический метод, который возвращает прототип (т.е. значение 
внутреннего свойства [[Prototype]]) указанного объекта.
Сигнатура: 
const prototype = Object.getPrototypeOf(obj);
где

Принимаемые параметры:
  - obj — обязательный параметр: объект, прототип которого нужно получить.

Возвращаемое значение - prototype:
  - Прототип указанного объекта (объект или null);
*/

//case 1
// const obj1 = { id: 12 }
// console.log(Object.getPrototypeOf(obj1)) //[Object: null prototype] {}

// //case 2
// class User {
//     constructor(id){
//         this.id = id
//     }
//     helloIrina(){
        
//     }
// }
// const user1 = new User('123')
// console.log(Object.getPrototypeOf(user1)) //{}

// 1. Базовое использование
// const obj1 = {};
// const proto1 = Object.getPrototypeOf(obj1);
// console.log(proto1 === Object.prototype); // true
// console.log(proto1); //выведет сам Object.prototype (запускать лучше в браузере)

// // 2. С пользовательским прототипом
// function Animal(name) {
//   this.name = name;
// }
// Animal.prototype.speak = function() {
//   console.log(`${this.name} makes a sound`);
// };

// const dog = new Animal('Rex');
// const proto2 = Object.getPrototypeOf(dog);
// console.log(proto2) //{ speak: [Function (anonymous)] }
// console.log(proto2 === Animal.prototype); // true
// console.log(proto2.speak); // [Function: speak]
// // // 3. Проверка цепочки прототипов
// const proto3 = Object.getPrototypeOf(dog);
// const proto4 = Object.getPrototypeOf(proto3);
// const proto5 = Object.getPrototypeOf(proto4);
// console.log(proto3 === Animal.prototype); // true
// console.log(proto4 === Object.prototype); // true
// console.log(proto5 === null); // true

/*
❗️Сравнение с instanceof 
 - instanceof проверяет всю цепочку
 - getPrototypeOf возвращает только непосредственный прототип
*/

/*
🔻🔻Object.defineProperty - статический метод, который определяет новое свойство на объекте или изменяет 
существующее свойство, возвращая этот объект. Позволяет точно контролировать поведение свойства через 
дескрипторы.

Сигнатура: 
Object.defineProperty(obj, prop, descriptor);
где
Принимаемые параметры:
  - obj — обязательный параметр: объект, на котором нужно определить или изменить свойство;
  - prop — обязательный параметр: имя или Symbol свойства, которое нужно определить или изменить;
  - descriptor — обязательный параметр: дескриптор свойства, который определяет его поведение.

Возвращаемое значение prototype:
  - obj - объект, на котором был определен или изменен параметр.

     descriptor  имеет следующие свойства для обычных свойств:
     - value — значение, связанное со свойством. По умолчанию: undefined;
     - writable — true только если значение свойства можно изменить. По умолчанию: false;
     - enumerable — true только если свойство отображается при перечислении. По умолчанию: false;
     - configurable — true только если тип дескриптора можно изменить и свойство можно удалить. 
     По умолчанию: false.

     descriptor  имеет следующие свойства для (геттеры/сеттеры):
     - get — функция-геттер или undefined, если геттера нет. По умолчанию: undefined;
     - set — функция-сеттер или undefined, если сеттера нет. По умолчанию: undefined;
     - enumerable — true только если свойство отображается при перечислении. По умолчанию: false;
     - configurable — true только если тип дескриптора можно изменить и свойство можно удалить. 
     По умолчанию: false.
*/
// 1. Создание свойства с полным контролем
// const obj1 = {};

// Object.defineProperty(obj1, 'readOnlyProp', {
//   value: 42,
//   writable: false,        // нельзя изменить
//   enumerable: true,       // видно в перечислениях
//   configurable: false     // нельзя удалить или переконфигурировать
// });

// console.log(obj1.readOnlyProp); // 42
// obj1.readOnlyProp = 100; // Бесшумно игнорируется в нестрогом режиме
// console.log(obj1.readOnlyProp); // 42 (не изменилось)


// 2. Неперечисляемое свойство
// const obj2 = { a: 1, b: 2 };

// Object.defineProperty(obj2, 'hidden', {
//   value: 'secret',
//   enumerable: false
// });

// console.log(obj2.hidden); // 'secret'
// console.log(Object.keys(obj2)); // ['a', 'b'] - hidden не видно
// console.log(Object.getOwnPropertyNames(obj2)); // ['a', 'b', 'hidden']
// console.log(obj2) //{ a: 1, b: 2 }

// 3. Строгий режим
// 'use strict';

// const obj = {};
// Object.defineProperty(obj, 'readonly', {
//   value: 42,
//   writable: false
// });

// obj.readonly = 100; // TypeError: Cannot assign to read only property


/*
🔻 Класс (class) — это удобный синтаксис для работы с прототипами и объектами. Он не вводит новую модель наследования, а лишь упрощает запись:
class MyClass {
    constructor(name) {
        this.name = name;
    }
    sayHi() {
        console.log(`Привет, ${this.name}`);
    }
}

🔻Синтаксический сахар - под капотом классы используют прототипное наследование.
Методы экземпляра записываются в MyClass.prototype.
Статические методы остаются свойствами самого класса.
*/


/* 📌 Задача 4.1 Используя синтаксис классов создайте вручную объект (связанный 
список), удовлетворяющей схеме ниже: 
[1] → [2] → [3]
*/
// class List{
//     constructor(value, next=null){
//         this.value = value
//         this.next = next
//     }
// }

// const linkedList1 = new List(1,
//     new List(
//         2, 
//         new List(3)
//     )
// )
// console.log(linkedList1)
/*
List {
  value: 1,
  next: List { 
    value: 2, 
    next: List { 
      value: 3, 
      next: null 
    } 
  }
}
*/

// const linkedList2 = {
//     value: 1,
//     next: {
//         value: 2,
//         next: {
//             value: 3,
//             next: null
//         }
//     }
// }

/* 📌 Задача 4.2 Используя синтаксис классов создайте вручную объект (дерево), 
удовлетворяющей схеме ниже: 
     [1]                   
    /   \                
  [2]   [3]              
  / \   / \             
[4][5] [6][7]
*/
// class Three{
//     constructor(value, left=null, right=null){
//         this.value = value
//         this.left = left
//         this.right = right
//     }
// }

// const myFirstThree = new Three()
// console.log(myFirstThree)


// class List {
//   constructor(value, left = null, right = null) {
//     this.value = value
//     this.left = left
//     this.right = right
//   }
// }


// const myFirstTree =
//   new List(1, 
//     new List(2, 
//       new List(4), 
//       new List(5),
//     ),
//     new List(3,
//       new List(6), 
//       new List(7)
//     ) 
// )
// console.log(myFirstTree)
//O☀️

//      [1]                   
//     /   \                
//   [2]   [3]              
//   / \   / \             
// [4][5] [6][7]

// class List{
//     constructor(value, left=null, right=null){
//         this.value = value
//         this.left = left
//         this.right = right
//     }
// }

// const myFirstThree = new List(
//     1,
//     new List(2, 
//         new List(4),
//         new List(5)
//     ),
//     new List(3,
//         new List(6),
//         new List(7)
//     ),
// )

// console.log(myFirstThree)
// //A☀️



// class List{
//     constructor(value, left=null, right=null){
//         this.value = value
//         this.left = left
//         this.right = right
//     }
// }

// const myFirstThree = new List(1,
//     new List(2, 
//         new List(4),
//         new List(5)),
//     new List(3,
//         new List(6),
//         new List(7))
// )
// console.log(myFirstThree)
// //P☀️

/* 📌 Задача 4.3 Используя синтаксис классов создайте вручную объект (дерево), 
удовлетворяющей схеме ниже: 
     ["root"]
    /        \
  [42]     ["hello"]
  /  \        /
[true][null] [7.5]
*/


/* 📌 Задача 4.4 Используя синтаксис классов создайте вручную объект, удовлетворяющей схеме ниже: 
        [1]
       /   \
     [2] ,  [3]
    /        \
  [4]        [5]
   \
    [6]
*/


// class Tree {
//     constructor(value, left = null, right=null){
//         this.value = value
//         this.left = left
//         this.right = right
//     }
// }

// const mainTree = new Tree(
//         1, 
//         new Tree(
//             2, 
//             new Tree(
//                 4,
//                 null, 
//                 new Tree(6)
//             ) 
//         ), 
//         new Tree(
//             3, 
//             null, 
//             new Tree(5), 
//         )
// )

// console.log(mainTree)
/*
Tree {
  value: 1,
  left: Tree {
    value: 2,
    left: Tree { value: 4, left: null, right: [Tree] },
    right: null
  },
  right: Tree {
    value: 3,
    left: null,
    right: Tree { value: 5, left: null, right: null }
  }
}
*/


/* 📌 Задача 4.5 Используя синтаксис классов создайте вручную объект (граф), 
удовлетворяющей схеме ниже: 
A - B
Имеет две вершины и ребро между ними
*/




/*
[1] -> [2]
 |
[3]

const myFirstGraph = {
    1: [2, 3],
    2: [],
    3: [1]
}


*/
// class Graph {
//     constructor(value) {
//         this.value = value 
//         this.neighboards = []
//     }
//     addNeighboards(node){
//         this.neighboards.push(node)
//     }
// }

// const A = new Graph('A')
// const B = new Graph('B')
// //
// A.addNeighboards(B)
// B.addNeighboards(A)
// console.log(A)
// console.log(B)

/*
Graph {
  value: 'A',
  neighboards: [ Graph { value: 'B', neighboards: [Array] } ]
}
Graph {
  value: 'B',
  neighboards: [ Graph { value: 'A', neighboards: [Array] } ]
}
*/

//❗️СПРОШУ ПОТОМ
class Game {
    title = 'Chess'
    constructor(title){
        /*
        const method = Object.getOwnPropertyDescriptor(this, "start") //undefined
        const funcArrow = Object.getOwnPropertyDescriptor(this, "startArrow") //{ value: [Function: startArrow], writable: true, enumerable: true, configurable: true }
        const funcExpress = Object.getOwnPropertyDescriptor(this, "startExpression") //{ value: [Function: startExpression], writable: true, enumerable: true, configurable: true }
        console.log(method, funcArrow, funcExpress)
        */
        this.title = title
    }
    start(){ //метод класса
        console.log(`strarting ${this.title}`)
        return 'Alex'
    }
    startArrow = () => { // фун Arrow
        console.log(`strarting ${this.title}`)
    }
    startExpression = function(){ //фун Expression
        console.log(`strarting ${this.title}`)
    }
}
const play1 = new Game('Chess')
// // const play2 = new Game('Swimming')
// // const play3 = new Game('MMA')
// //❗Нахождение:
// /*
// console.log(play1) //Game {title: 'Chess', startArrow, startExpression }
// console.log(play1.start === play2.start) //true 
// console.log('start' in Game.prototype) //true
// console.log(play1.startArrow === play2.startArrow) //false
// console.log(play1.startExpression === play2.startExpression) //false
// console.log('startArrow' in Game.prototype) //false
// console.log(Game.prototype.hasOwnProperty('startExpression')) //false
// */
// //❗️Обращение к классу:
// /*
// Game.start()//TypeError: Game.start is not a function
// Game.startArrow //TypeError: Game.startArrow is not a function
// Game.startExpression //TypeError: Game.startExpression is not a function
// */
// //❗️Вызов метода:
// /*
// play1.start() //Starting Chess
// play1.startArrow() //Starting Chess
// play1.startExpression() //Starting Chess
// */
// //❗️Сохр в перем с послед вызовов:
// const callStart = play1.start.bind(play1)
//play1.start() //strarting Chess
// const callStartArrow = play1.startArrow
//play1.startArrow() //strarting Chess
// const callStartExpression = play1.startExpression.bind(play1)
//play1.startExpression() //strarting Chess

//const callStartExpression = play1.startExpression()

// //Вызовы:
// ️//callStart() //TypeError: Cannot read properties of undefined (reading 'title')
// //callStartArrow() //Starting Chess
// //callStartExpression() //TypeError: Cannot read properties of undefined (reading 'title')
// //❗️Починки: 

// callStart() // strarting Chess
// callStartArrow() //strarting Chess
// callStartExpression() //strarting Chess

/*
🔻Обычный метод класса start:
 - Находится в Game.prototype. Все экземпляры делят одну функцию, что экономит 
 память;
 - this определяется в момент вызова (динамически, как у expression);
 - При присваивании const callStart = play3.start теряется связь с объектом.
Достоинства: экономит память;
Недостатки: теряет контекст при отсоединении.

🔻Стрелочная функция startArrow:
 - Нет в прототипе (как у expression);
 - this захватывается лексически при создании объекта и всегда указывает на 
 экземпляр. Сохраняет контекст независимо от способа вызова;
 - Создается каждый раз как свойство экземпляра при конструкторе;
 - Каждая стрелочная функция уникальна для экземпляра 
 play1.startArrow !== play2.startArrow.
Достоинства: сохраняет контекст;
Недостатки: затраты памяти на создание функции.

🔻Функция-выражение:
 - Нет в прототипе (как у стрелочной);
 - this определяется в момент вызова (динамически, как у обычного метода);
 - Создается каждый раз как свойство экземпляра при конструкторе;
 - При присваивании const callStartExpression = play3.startExpression теряется 
 связь с объектом;
 - Каждая функция-выражение уникальна для экземпляра → 
 play1.startExpression !== play2.startExpression;
Недостатки: тратит память на создание новой функции, теряет контекст при 
отсоединении.
*/
// function(name){
//     this.name = name
// }


//🔻ОБЫЧНЫЕ ПОЛЯ
/*
class Diger {
    constructor(name){
        this.name = name
    }
}
const myStudent = new Diger('Olga')
console.log(myStudent) //Diger{ name: "Olga" }
console.log(myStudent.constructor === Diger) // true
console.log(myStudent.constructor.name) // Diger
console.log(typeof myStudent.constructor) //function  
*/
// function foo(){
//     console.log(foo.name) //foo
// }
// foo()
// Класс Game:
// ├── prototype
// │   ├── constructor → Game (функция-конструктор)
// │   └── [[Prototype]] → Object.prototype
// └── ...

// Экземпляр play1:
// ├── title: "Chess"  ← обычное поле экземпляра
// └── [[Prototype]] (__proto__):
//     ├── constructor → Game  ← ссылка на функцию-конструктор Game
//     └── [[Prototype]] → Object.prototype

//🔻ПРИВАТНЫЕ ПОЛЯ
// class MyClass {
//     #age = 20
//     constructor(name) {
//         console.log(this.#age)
//         this.name = name
//     }
//     getName() {
//         console.log(`my name: ${this.name}`)
//     }
//     helloAlexander(newAge) {
//         this.#age = newAge
//         console.log(`my age: ${this.#age}`)
//     }
// }
// const person1 = new MyClass("irina")
// person1.helloAlexander(30)
// Класс Rectangle (функция-конструктор):
// ├── prototype
// │   ├── constructor → Rectangle
// │   └── [[Prototype]] → Object.prototype
// ├── [[ClassPrivateSlots]]        ← внутренняя таблица приватных полей класса
// │   ├── #height: PrivateName     ← уникальный идентификатор приватного поля
// │   └── [[PrivateBrand]]         ← метка для проверки доступа
// └── ...

// Экземпляр square:
// ├── [[PrivateElements]]         ← внутренний слот для приватных полей экземпляра
// │   └── { #height: 10 }         ← приватное поле (не доступно как обычное свойство)
// └── [[Prototype]] (__proto__) → Rectangle.prototype
//     └── constructor → Rectangle


class Person{
  static age = 20 
  
  constructor(name){
      this.name = name 
  }
}

const person1 = new Person('Kate')
console.log(Person.age)
const result = Person.hasOwnProperty('age')
console.log(result)
// Класс Rectangle (функция-конструктор):
// ├── height: 2                    ← статическое поле (свойство самой функции)
// ├── prototype
// │   ├── constructor → Rectangle
// │   └── [[Prototype]] → Object.prototype
// └── [[Prototype]] → Function.prototype
//     └── constructor → Function

// Экземпляр square:
// ├── height: 10                   ← обычное поле экземпляра
// └── [[Prototype]] (__proto__) → Rectangle.prototype
//     └── constructor → Rectangle
//         ├── height: 2           ← статическое поле (доступ через цепочку)
//         └── [[Prototype]] → Function.prototype











//
