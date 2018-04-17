title: 海 the sea
date: 2017-03-13 08:31:42
updated: 2017-08-11 17:57:53
tags: [sample]
categories: [sample]
---

来这里主要是玩水，如果你喜欢游泳，来这里吧。我是在这学会狗爬式的。哈哈。。
先来看看一些照片。

![](https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/28576459_512967365764224_8030377315271372952_n.jpg?oh=cca292bd897405a896e18d958863cb9d&oe=5B42E361)
网络图片

![](/images/masasa/IMG_1429.JPG)
本地图片
没错，螃蟹船很好看，他们喜欢涂成各种颜色，艺术细胞不错。以及。。真正蓝色的大海，而不是灰色的。

title: 简洁代码与冗余代码
tags:
  - react
  - best practices
categories:
  - javascript
translateFrom: 'http://americanexpress.io/clean-code-dirty-code/'
date: 2017-11-29 09:49:43
updated: 2017-11-29 09:49:43
topImage:
---


# 简洁代码与冗余代码

这篇文章将重点介绍适用于现代 react 软件开发的简洁代码之道。我还会谈谈 ES6/ES2015 带来的一些“语法糖”。
<!-- more -->

## 什么是简洁代码之道，为什么我如此关心？

简洁代码之道的一贯编码风格是让你的代码更易写、易读和易维护。经常，程序员在一个问题上花了许多时间，一旦问题被解决，就提交代码。我一直主张，你的工作并没有完成，因为你只是让你的代码“正常工作”而已。

这是一个机会来精简你的代码，通过删除死代码（僵尸代码）、重构、删除被注释的代码！努力提高可维护性。扪心自问，“6个月后其他人还能理解你的代码吗？”

简单来说，编写能让你自豪到带回家和母亲炫耀的代码。

为什么你要这么关心这个问题？因为如果你是一个好开发者，你会很懒。听我说完，我是赞扬的意思。一个好的开发者，面对同一件事要做很多遍的状况，通常会寻找一个自动解决（或更好的）方案来完成眼前的任务。所以，因为你很懒，关注简洁代码的技术将会减少你拉取代码一遍又一遍地 review 同一段代码的频率。

## 通过嗅觉测试精简代码

精简代码应该通过嗅觉测试。不明白我是什么意思？我们都看着（自己的或别人的）代码说：“这里不太对劲。” 记住，如果感觉不太对劲，那可能真的不对劲。一起对代码深思熟虑是好的。但如果你发觉你正在把一个方形的钉子插进一个圆形的洞里，那就请停下来，退一步，并且休息一下。最多十次，你会找到更好的解决办法的。

## 精简代码就是 DRY （禁止重复）

DRY 是 “Don't repeat yourself!” 的缩写。如果一件事你做了很多遍，合并重复的代码。如果你在你代码里发现了设计模式，那是一个删除重复的迹象。有时候这意味着你站得离屏幕远远地，直到你看不清文字，也无法寻找模式。

```jsx
// Dirty
const MyComponent = () => (
  <div>
    <OtherComponent type="a" className="colorful" foo={123} bar={456} />
    <OtherComponent type="b" className="colorful" foo={123} bar={456} />    
  </div>
);
```

```jsx
// Clean
const MyOtherComponent = ({ type }) => (
  <OtherComponent type={type} className="colorful" foo={123} bar={456} />
);
const MyComponent = () => (
  <div>
    <MyOtherComponent type="a" />
    <MyOtherComponent type="b" />
  </div>
);
```

有时候，就像上面的例子那样 —— 删除重复代码并不会减少代码量。但是，删除重复代码一般会提高可维护性。

要注意，不要在删除重复代码这件事上做得太过分了，所以要知道什么时候该说什么。

## 简洁的代码是可预测和可测试的

编写单元测试不仅仅是一个好主意，它已经几乎变成强制性的。毕竟，你怎样确保新特性没有在某些地方引起一些 bugs。

许多 react 开发者依靠零配置的 [jest](https://facebook.github.io/jest/) 测试库，并产出覆盖报告。如果你对前后视觉对照测试感兴趣，请尝试一下 美国运通开源的 [Jest Image Snapshot](https://github.com/americanexpress/jest-image-snapshot)。

## 简洁的代码能自我说明

你之前有遇到过吗？你写了一些代码，并确保它拥有完整的注释。将会发生这样的情况，你发现一个 bug, 所以你回去修改代码。你还记得修改注释并对应新的逻辑吗？也许记得。也许不记得。下一个看你代码的人可能已经掉进兔子洞（被绕进去了）因为他还在看以前的注释。

只给复杂的思路添加注释。不要给显而易见的代码添加注释。更少量的注释也有利于减少视觉干扰。

```js
// Dirty
const fetchUser = (id) => (
  fetch(buildUri`/users/${id}`) // Get User DTO record from REST API
    .then(convertFormat) // Convert to snakeCase
    .then(validateUser) // Make sure the the user is valid
);
```

而简洁版，我们重命名函数以便更好地描述他们是做什么的，因此消除了注释的必要并减少视觉干扰。这限制了代码与注释不匹配的潜在混乱。

```js
// Clean
const fetchUser = (id) => (
  fetch(buildUri`/users/${id}`)
    .then(snakeToCamelCase)
    .then(validateUser)
);
```

## 命名的重要性

在我前面的文章 [子组件的函数是一种反模式](http://americanexpress.io/faccs-are-an-antipattern), 我强调了命名的重要性。我们应该严肃思考变量名、函数名、甚至文件名。

下面是一些指南：

- 布尔值变量、或返回布尔值的函数，应该以 "is", "has", "should" 开头。

```js
// Dirty
const done = current >= goal;
// Clean
const isComplete = current >= goal;
```

- 函数名应该描述函数的功能是什么，而不是怎样实现这个功能。换句话说，不要在命名中暴露实现细节。为什么？因为不知道哪一天你就会换一种实现，而你不应该为重构实现方式而去更改业务代码。举个例子，今天你可能通过 REST API 加载你的配置，但可能明天你又改成用 javascipt 实现。

```js
// Dirty
const loadConfigFromServer = () => {
  ...
};
// Clean
const loadConfig = () => {
  ...
};
```

## 简洁代码遵循成熟的设计模式和最佳实践

计算机普及很长时间了。多年来，程序员在解决某些问题的时候发现模式。被称为 设计模式。换句话说，它是随着时间推移被证明的有用的算法。你可以站在这些巨人的肩上，以便避免再犯这些错误。

然后有一些最佳实践，它们和设计模式很类似，但更广义，不具体指编码算法。它们可能涉及到类似“你应该在编码时使用 lint 工具” 或者 “当你写一个类库时，请包含 react 作为 `peerDependency`”。

- 将函数功能缩小，每一个都职责单一。这个叫做职责单一原则。确保每个函数做好并只做一件事。意思是你可以将一个复杂的组件拆分成许多小的部分。这也会让代码更易测试。
- 注意抽象接口。换句话说，不要强制让你的业务代码使用私有变量或私有方法。
- 遵循严格的 linting 规则，它会帮助你编写简洁、风格统一的代码。

## 简洁的代码不一定要花费更长时间

我听到编写简洁的代码会降低工作效率。真是一派胡言。是的，为了冲刺，一开始你需要放慢脚步，但是写了几行代码后，你的步伐会越来越快。

并且不要考虑将来再“重构”它，并花时间修复来自 code review 的评论。如果你将代码拆分成小模块，每个都职责单一，很可能将来大部分模块都不会碰。这就是通过“写下它，忘了它”来了省时间。

## 冗余代码 VS. 简洁代码的实践例子

看看下面的代码。继续看，并返回到前面我所讲的内容。你有看到什么模式吗？注意到 `Thingie` 组件和 `ThingieWithTitle` 组件除了 `Title` 组件之外都完全相同。这满足了 DRY 的条件。

```jsx
// Dirty
import Title from './Title';
export const Thingie = ({ description }) => (
  <div class="thingie">
    <div class="description-wrapper">
      <Description value={description} />
    </div>
  </div>
);
export const ThingieWithTitle = ({ title, description }) => (
  <div>
    <Title value={title} />
    <div class="description-wrapper">
      <Description value={description} />
    </div>
  </div>
);
```

这里允许我们传递 `children` 到 `Thingie`, 然后创建一个 `ThingieWithTitle` 包裹 `Thingie`，传递 `Title` 作为它的子节点。

```jsx
// Clean
import Title from './Title';
export const Thingie = ({ description, children }) => (
  <div class="thingie">
    {children}
    <div class="description-wrapper">
      <Description value={description} />
    </div>
  </div>
);
export const ThingieWithTitle = ({ title, ...others }) => (
  <Thingie {...others}>
    <Title value={title} />
  </Thingie>
);
```

## 默认值

看下面的代码段。它默认使用 `icon-large` 作为 `className` 的声明值。

```jsx
// Dirty
const Icon = ({ className, onClick }) => {
  const additionalClasses = className || 'icon-large';
  return (
    <span
      className={`icon-hover ${additionalClasses}`}
      onClick={onClick}>
    </span>
  );
};
```

这里我们使用 ES6 默认语法，用字符串来替换未定义的值。这也允许我们使用箭头函数，并消除 return 的使用。

```jsx
// Clean
const Icon = ({ className = 'icon-large', onClick }) => (
  <span className={`icon-hover ${className}`} onClick={onClick} />
);
```

下面是更简洁的版本，默认值通过 react 设置。

```jsx
// Cleaner
const Icon = ({ className, onClick }) => (
  <span className={`icon-hover ${className}`} onClick={onClick} />
);
Icon.defaultProps = {
  className: 'icon-large',
};
```

为什么这样更简洁？为什么这样更好？三个版本做的不是同样一件事吗？对于大部分情况来说，确实是的。但是，让 react 设置默认值的好处是会产生更高效的代码。默认 props 基于类的组件生命周期,同时允许你使用 `propTypes` 检查默认值。但还有一个好处：简化组件自身的默认逻辑。

举个例子，你可以这样做，在一个变量里存储所有默认的 props。我不建议你这样做，我只是说你可以有这种做法。

```jsx
import defaultProps from './defaultProps';
...
Icon.defaultProps = defaultProps.Icon;
```

## 从 render 函数中分离状态

在 render 函数中混合你的状态数据加载逻辑会让组件变得更复杂。相反，写一个职责单一的状态容器组件去加载数据。然后用另一个职责单一的组件去显示数据。这叫做 [容器模式](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)。

下面这个例子，用户数据在同一个组件中加载和显示。

```jsx
// Dirty
class User extends Component {
  state = { loading: true };

  render() {
    const { loading, user } = this.state;
    return loading
      ? <div>Loading...</div>
      : <div>
          <div>
            First name: {user.firstName}
          </div>
          <div>
            First name: {user.lastName}
          </div>
          ...
        </div>;
  }

  componentDidMount() {
    fetchUser(this.props.id)
      .then((user) => { this.setState({ loading: false, user })})
  }
}
```

在简洁版本，关注点 —— 数据加载，显示加载动画，和显示数据被分离了。不仅让代码更容易理解。而且很容易独立地测试每个关注点。同时 `RenderUser` 是一个无状态组件。结果是可预测的。

```jsx
// Clean
import RenderUser from './RenderUser';
class User extends Component {
  state = { loading: true };

  render() {
    const { loading, user } = this.state;
    return loading ? <Loading /> : <RenderUser user={user} />;
  }

  componentDidMount() {
    fetchUser(this.props.id)
      .then(user => { this.setState({ loading: false, user })})
  }
}
```

## 使用无状态组件 SFC

无状态组件（SFC）在 React v0.14.0 的时候被推出。它们被用来大大简化一个仅用于渲染的组件。但很多开发者还没有放下过去。举个例子，下面这个组件具备转换成 SFC 的条件。

```jsx
// Dirty
class TableRowWrapper extends Component {
  render() {
    return (
      <tr>
        {this.props.children}
      </tr>
    );
  }
}
```

简洁版清理了很多冗余版本的干扰的东西。通过 react 的核心优化，有可能使用更少的内存，没有实例被创建。

```jsx
// Clean
const TableRowWrapper = ({ children }) => (
  <tr>
    {children}
  </tr>
);
```

## Rest/spread (...操作符)

大约一年前，在我心中 `Object.assign` 将会变成每个人最好的新朋友。但是，时代变了，ES2016/ES7 的 [rest/spread spec](https://github.com/tc39/proposal-object-rest-spread) 来了。

看一个给组件传递 props 的案例。你想在组件内使用 `className`，但把剩余的 props 传递给子组件。你可能会这样做。

```jsx
// Dirty
const MyComponent = (props) => {
  const others = Object.assign({}, props);
  delete others.className;
  return (
    <div className={props.className}>
      {React.createElement(MyOtherComponent, others)}
    </div>
  );
};
```

不够优雅，不是么？但使用 rest/spread, 就像看到一块蛋糕一样。

```jsx
// Clean
const MyComponent = ({ className, ...others }) => (
  <div className={className}>
    <MyOtherComponent {...others} />
  </div>
);
```

## 适时使用解构

ES6 有一个概念叫 [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)解构赋值。它允许你取出 object 或 array 里的某个值。

### object destructuring 对象解构

比如，给 `componentWillReceiveProps` 传递了 `newProps`，我们给 `state.active` 设置一个新的 `active` 值。

```jsx
// Dirty
componentWillReceiveProps(newProps) {
  this.setState({
    active: newProps.active
  });
}
```

在简洁版本中，我们将解构 `newProps` 里的 `active`， 不仅不再需要引用 `newProps.active`, 而且可以只使用对象中的属性名 `setState`:

```jsx
// Clean
componentWillReceiveProps({ active }) {
  this.setState({ active });
}
```

### array destructuring 数组解构

经常忽视 ES6 的数组解构特性。下面这个例子，它从 `local` 取出一个值,比如 "es-US", 拆分并赋值给 `language`(en) 和 `country`(US)

```jsx
// Dirty
const splitLocale = locale.split('-');
const language = splitLocale[0];
const country = splitLocale[1];

// Clean
const [language, country] = locale.split('-');

```


## 总结

我希望我让你看到编写简洁代码的好处，并可以应用这里呈现的实际例子。一旦你拥抱简洁代码，它将成为你的第二天性。你和未来的你将会感激“写下它，忘了它”的生活方式。