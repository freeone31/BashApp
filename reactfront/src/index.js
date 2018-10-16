'use strict';
import css from './index.css';
import Pager from './pager.jsx';

const client = require('./client.js');
const follow = require('./follow.js');
const React = require('react');
const ReactDOM = require('react-dom');
const root = '/api';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			quotes: [],
			users: [],
			q_attributes: [],
			u_attributes: [],
			pageSize: 4,
			q_links: {},
			u_links: {},
			action: 'show',
			authorAuto: '',
			authorManual: '',
			quoteText: '',
			sortby: 'datetime,desc',
			usernamesmap: [],
			totalPages: 1,
			currentPage: 0,
			visiblePage: 3
		};

		this.onAddQuote = this.onAddQuote.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onReset = this.onReset.bind(this);
		this.onAuthorChanged = this.onAuthorChanged.bind(this);
		this.onAuthorSelected = this.onAuthorSelected.bind(this);
		this.onTextChanged = this.onTextChanged.bind(this);
		this.onSortChanged = this.onSortChanged.bind(this);
		this.handlePageChanged = this.handlePageChanged.bind(this);
	}

	loadFromServer(currentPage, pageSize, sortby) {
		follow(client, root, ['dz_users']
		).then(userCollection => {
			return client({
				method: 'GET',
				path: userCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(u_schema => {
				this.u_schema = u_schema.entity;
				return userCollection;
			});
		}).done(userCollection => {
			var tempusernamesmap = [];
			userCollection.entity._embedded.dz_users.forEach(u => {
				var temppair = {uid: Number(u._links.self.href.substr(u._links.self.href.lastIndexOf('/') + 1)), uname: u.name};
				tempusernamesmap.push(temppair);
			});

			this.setState({
				users: userCollection.entity._embedded.dz_users,
				u_attributes: Object.keys(this.u_schema.properties),
				u_links: userCollection.entity._links,
				usernamesmap: tempusernamesmap
			});
		});

		follow(client, root, [{rel: 'dz_quotes', params: {page: currentPage, size: pageSize, sort: sortby}}]
		).then(quoteCollection => {
			return client({
				method: 'GET',
				path: quoteCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(q_schema => {
				this.q_schema = q_schema.entity;
				return quoteCollection;
			});
		}).done (quoteCollection => {
			this.setState({
				quotes: quoteCollection.entity._embedded.dz_quotes,
				q_attributes: Object.keys(this.q_schema.properties),
				pageSize: pageSize,
				sortby: sortby,
				q_links: quoteCollection.entity._links,
				totalPages: quoteCollection.entity.page.totalPages,
				currentPage: quoteCollection.entity.page.number
			});
			//console.log('this.state = ' + JSON.stringify(this.state));
		});
	}

	handlePageChanged(newPage) {
		this.loadFromServer(newPage, this.state.pageSize, this.state.sortby);
	}

	onAddQuote(e) {
		e.preventDefault();
		this.setState({action: 'add'});
	}

	onSubmit(e) {
		e.preventDefault();
		// проверка на непустое имя и текст цитаты
		if (this.state.authorManual.length === 0 || !this.state.authorManual.trim()) {
			alert('Выберите или введите свое имя!');
		} else if (this.state.quoteText.length === 0 || !this.state.quoteText.trim()) {
			alert('Введите текст цитаты!');
		} else {
			var newQuote = {}; // добавляемая цитата
			newQuote.text = this.state.quoteText; // текст цитаты
			newQuote.datetime = new Date(); // дата добавления цитаты

			var isNewUser = true; // флаг, создаем нового юзера или выбираем старого из списка
			this.state.users.forEach(u => {
				if (u.name == this.state.authorManual) {
					isNewUser = false;
				}
			});

			if (isNewUser == true) { //если создаем нового юзера, сначала нужно создать его, потом прописать его айди в автора цитаты
				var newUser = {};
				newUser.name = this.state.authorManual;

				follow(client, root, ['dz_users']
				).then(userCollection => { // отправили запрос на добавление юзера
					return client({
						method: 'POST',
						path: userCollection.entity._links.self.href,
						entity: newUser,
						headers: {'Content-Type': 'application/json'}
					});
				}).done(response => {
					follow(client, root, ['dz_users']
					).then(userCollection => { // после успешного выполнения получаем новый список юзеров
						return client({
							method: 'GET',
							path: userCollection.entity._links.profile.href,
							headers: {'Accept': 'application/schema+json'}
						}).then(u_schema => {
							this.u_schema = u_schema.entity;
							return userCollection;
						});
					}).done(userCollection => {
						this.setState({
							users: userCollection.entity._embedded.dz_users,
							u_attributes: Object.keys(this.u_schema.properties),
							u_links: userCollection.entity._links
						});

						this.state.users.forEach(u => { // сохраняем автора цитаты
							if (u.name === newUser.name) {
								newQuote.userid = Number(u._links.self.href.substr(u._links.self.href.lastIndexOf('/') + 1));
							}
						});

						follow(client, root, [{rel: 'dz_quotes', params: {page: this.state.currentPage, size: this.state.pageSize, sort: this.state.sortby}}]
						).then(quoteCollection => { // отправили запрос на добавление цитаты
							return client({
								method: 'POST',
								path: quoteCollection.entity._links.self.href,
								entity: newQuote,
								headers: {'Content-Type': 'application/json'}
							});
						}).done(response => { // после успешного выполнения получаем новый список цитат
							follow(client, root, [{rel: 'dz_quotes', params: {page: this.state.currentPage, size: this.state.pageSize, sort: this.state.sortby}}]
							).then(quoteCollection => {
								return client({
									method: 'GET',
									path: quoteCollection.entity._links.profile.href,
									headers: {'Accept': 'application/schema+json'}
								}).then(q_schema => {
									this.q_schema = q_schema.entity;
									return quoteCollection;
								});
							}).done(quoteCollection => {
								this.setState({
									quotes: quoteCollection.entity._embedded.dz_quotes,
									q_attributes: Object.keys(this.q_schema.properties),
									pageSize: this.state.pageSize,
									sortby: this.state.sortby,
									q_links: quoteCollection.entity._links,
									totalPages: quoteCollection.entity.page.totalPages,
									currentPage: quoteCollection.entity.page.number,
									action: 'show',
									authorManual: '',
									authorAuto: '',
									quoteText: ''
								});
								this.loadFromServer(this.state.currentPage, this.state.pageSize, this.state.sortby);
							});
						});
					});
				});
			} else { // если юзер старый, сразу добавляем цитату
				this.state.users.forEach(u => {
					if (u.name === this.state.authorManual) {
						newQuote.userid = Number(u._links.self.href.substr(u._links.self.href.lastIndexOf('/') + 1));
					}
				});

				follow(client, root, [{rel: 'dz_quotes', params: {page: this.state.currentPage, size: this.state.pageSize, sort: this.state.sortby}}]
				).then(quoteCollection => { // отправили запрос на добавление цитаты
					return client({
						method: 'POST',
						path: quoteCollection.entity._links.self.href,
						entity: newQuote,
						headers: {'Content-Type': 'application/json'}
					});
				}).done(response => { // после успешного выполнения получаем новый список цитат
					follow(client, root, [{rel: 'dz_quotes', params: {page: this.state.currentPage, size: this.state.pageSize, sort: this.state.sortby}}]
					).then(quoteCollection => {
						return client({
							method: 'GET',
							path: quoteCollection.entity._links.profile.href,
							headers: {'Accept': 'application/schema+json'}
						}).then(q_schema => {
							this.q_schema = q_schema.entity;
							return quoteCollection;
						});
					}).done(quoteCollection => {
						this.setState({
							quotes: quoteCollection.entity._embedded.dz_quotes,
							q_attributes: Object.keys(this.q_schema.properties),
							pageSize: this.state.pageSize,
							sortby: this.state.sortby,
							q_links: quoteCollection.entity._links,
							totalPages: quoteCollection.entity.page.totalPages,
							currentPage: quoteCollection.entity.page.number,
							action: 'show',
							authorManual: '',
							authorAuto: '',
							quoteText: ''
						});
						this.loadFromServer(this.state.currentPage, this.state.pageSize, this.state.sortby);
					});
				});
			};
		}
	}

	onReset(e) {
		e.preventDefault();
		this.setState({action: 'show', authorManual: '', authorAuto: '', quoteText: ''});
	}

	onAuthorChanged(event) {
		this.setState({authorManual: event.target.value});
	}

	onTextChanged(event) {
		this.setState({quoteText: event.target.value});
	}

	onAuthorSelected(event) {
		this.setState({authorManual: event.target.value, authorAuto: event.target.value});
	}

	onSortChanged(event) {
		this.loadFromServer(this.state.currentPage, this.state.pageSize, event.target.value);
	}

	componentDidMount() {
		this.loadFromServer(this.state.currentPage, this.state.pageSize, this.state.sortby);
	}

	render() {
		if (this.state.action == 'show') {
			return (
				<div>
					<table>
						<tbody>
							<tr>
								<td valign="top">
									<QuoteList
										quotes={this.state.quotes}
										q_links={this.state.q_links}
										pageSize={this.state.pageSize}
										sortby={this.state.sortby}
										users={this.state.users}
										u_links={this.state.u_links}
										usernamesmap={this.state.usernamesmap}
									/>
									<Pager
										total={this.state.totalPages}
										current={this.state.currentPage}
										visiblePages={this.state.visiblePage}
										titles={{first: "Первая", prev: "<", prevSet: "...", nextSet: "...", next: ">", last: "Последняя"}}
										onPageChanged={this.handlePageChanged}
									/>
								</td>
								<td valign="top">
									Сортировка: <select name="sort_select" onChange={this.onSortChanged} value={this.state.sortby}>
													<option value="text,asc">Текст (по возрастанию)</option>
													<option value="text,desc">Текст (по убыванию)</option>
													<option value="datetime,asc">Дата (по возрастанию)</option>
													<option value="datetime,desc">Дата (по убыванию)</option>
													<option value="userid,asc">Пользователь (по возрастанию)</option>
													<option value="userid,desc">Пользователь (по убыванию)</option>
												</select><br/><br/>
									<button className="btnadd" key="addQuote" onClick={this.onAddQuote}>+ Добавить цитату</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			)
		}
		else {
			var userNamesList = this.state.users.map(us => <option key={us._links.self.href} value={us.name}>{us.name}</option>);

			return (
				<div>
					<form onSubmit={this.onSubmit} onReset={this.onReset}>
						<h4>Имя</h4>
						<input type="text" name="name_input" size="40" value={this.state.authorManual} onChange={this.onAuthorChanged} placeholder="Введите или выберите имя"/>
						<b>   </b>
						<select name="name_select" onChange={this.onAuthorSelected} value={this.state.authorAuto}>{userNamesList}</select><br/><br/>
						<textarea name="quote_text" cols="60" rows="16" placeholder="Поле ввода текста" onChange={this.onTextChanged}></textarea><br/>
						<input className="btnreset" type="reset" value="Отменить"/>
						<b>   </b>
						<input className="btnadd" type="submit" value="Добавить!"/>
					</form>
				</div>
			)
		}
	}
}

class QuoteList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var quotesArr = this.props.quotes.map(quoteElem => <Quote key={quoteElem._links.self.href} quote={quoteElem} usernamesmap={this.props.usernamesmap}/>);

		return (
			<div>
				<table>
					<tbody>
						{quotesArr}
					</tbody>
				</table>
			</div>
		)
	}
}

class Quote extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var usname;
		this.props.usernamesmap.forEach(p => {
			if (p.uid === this.props.quote.userid) {
				usname = p.uname;
			}
		});

		return (
			<tr>
				<td width="700">
					<h4>{(new Date(this.props.quote.datetime)).toLocaleString()}    {usname}</h4>
					<p>{this.props.quote.text}</p>
					<hr/>
				</td>
			</tr>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('root'))