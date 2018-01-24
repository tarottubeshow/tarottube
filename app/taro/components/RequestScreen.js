// import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { connect as reduxConnect } from 'react-redux'
//
// import * as NB from 'native-base'
//
// class HamburgerScreenView extends Component {
//
//   static propTypes = {
//     goto: PropTypes.func,
//   }
//
//   onBack = () => {
//     const {
//       goto,
//     } = this.props
//     goto({
//       context: 'home',
//     })
//   }
//
//   render = () => {
//     return (
//       <Container>
//         { this.renderHeader() }
//         { this.renderMain() }
//       </Container>
//     )
//   }
//
//   renderHeader = () => {
//     return (
//       <Header>
//         <Left>
//           <Button
//             transparent
//             onPress={ this.onBack }
//           >
//             <Icon name='ios-arrow-back' />
//           </Button>
//         </Left>
//         <Body>
//           <Title>Tarot Tube Menu</Title>
//         </Body>
//         <Right />
//       </Header>
//     )
//   }
//
//   renderMain = () => {
//     return (
//       <Content>
//         <List>
//           { ACTIONS.map(this.renderListItem) }
//         </List>
//       </Content>
//     )
//   }
//
// }
//
// const HamburgerScreen = metautil.applyHocs(
//   HamburgerScreenView,
//   reduxConnect(
//     (state, props) => ({
//     }),
//     (dispatch, props) => ({
//       goto: RouterActions.routeActionMapper(dispatch),
//     }),
//   ),
// )
//
// export default HamburgerScreen
