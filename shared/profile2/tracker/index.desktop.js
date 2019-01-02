// @flow
import * as React from 'react'
import * as Kb from '../../common-adapters'
import * as Constants from '../../constants/profile2'
import * as Types from '../../constants/types/profile2'
import * as Styles from '../../styles'
import * as Flow from '../../util/flow'
import Assertion from '../assertion/remote-container'
import Bio from '../bio/remote-container'

type Props = {|
  assertions: ?$ReadOnlyArray<string>,
  bio: ?string,
  followThem: ?boolean,
  followersCount: ?number,
  followingCount: ?number,
  followsYou: ?boolean,
  guiID: ?string,
  location: ?string,
  onFollow: () => void,
  onChat: () => void,
  onClose: () => void,
  onIgnoreFor24Hours: () => void,
  onAccept: () => void,
  publishedTeams: ?$ReadOnlyArray<string>,
  reason: string,
  state: Types.DetailsState,
  username: string,
|}

const Tracker = (props: Props) => {
  let assertions
  if (props.assertions) {
    assertions = props.assertions.map(a => <Assertion key={a} username={props.username} assertion={a} />)
  } else {
    // TODO could do a loading thing before we know about the list at all?
    assertions = null
  }

  let backgroundColor
  if (props.state === 'error') {
    backgroundColor = Styles.globalColors.red
  } else {
    backgroundColor = props.followThem ? Styles.globalColors.green : Styles.globalColors.blue
  }

  const buttonClose = (
    <Kb.WaitingButton
      type="Secondary"
      key="Close"
      label="Close"
      waitingKey={Constants.waitingKey}
      onClick={props.onClose}
    />
  )
  const buttonAccept = (
    <Kb.WaitingButton
      type="PrimaryGreen"
      key="Accept"
      label="Accept"
      waitingKey={Constants.waitingKey}
      onClick={props.onAccept}
    />
  )
  const buttonChat = (
    <Kb.WaitingButton
      type="Primary"
      key="Chat"
      label="Chat"
      waitingKey={Constants.waitingKey}
      onClick={props.onChat}
    >
      <Kb.Icon type="iconfont-chat" color={Styles.globalColors.white} style={styles.chatIcon} />
    </Kb.WaitingButton>
  )

  let buttons = []
  switch (props.state) {
    case 'checking':
      break
    case 'valid':
      buttons = props.followThem
        ? [buttonClose, buttonChat]
        : [
            buttonChat,
            <Kb.WaitingButton
              type="PrimaryGreen"
              key="Follow"
              label="Follow"
              waitingKey={Constants.waitingKey}
              onClick={props.onFollow}
            />,
          ]
      break
    case 'error':
      buttons = [
        <Kb.WaitingButton
          type="Secondary"
          key="Ignore for 24 hours"
          label="Ignore for 24 hours"
          waitingKey={Constants.waitingKey}
          onClick={props.onIgnoreFor24Hours}
        />,
        buttonAccept,
      ]
      break
    case 'needsUpgrade':
      buttons = [buttonChat, buttonAccept]
      break
    case 'canceled':
      buttons = [buttonClose]
      break
    default:
      Flow.ifFlowComplainsAboutThisFunctionYouHaventHandledAllCasesInASwitch(props.state)
  }

  // In order to keep the 'effect' of the card sliding up on top of the text the text is below the scroll area. We still need the spacing so we draw the text inside the scroll but invisible

  return (
    <Kb.Box2 direction="vertical" fullWidth={true} fullHeight={true} style={styles.container}>
      <Kb.Text type="BodySmallSemibold" style={Styles.collapseStyles([styles.reason, {backgroundColor}])}>
        {props.reason}
      </Kb.Text>
      <Kb.ScrollView style={styles.scrollView}>
        <Kb.Box2 direction="vertical">
          <Kb.Text type="BodySmallSemibold" style={styles.reasonInvisible}>
            {props.reason}
          </Kb.Text>
          <Kb.Box2 direction="vertical" fullWidth={true} style={styles.avatarContainer}>
            <Kb.Box2 direction="vertical" style={styles.avatarBackground} />
            <Kb.ConnectedNameWithIcon
              onClick="profile"
              username={props.username}
              colorFollowing={true}
              notFollowingColorOverride={Styles.globalColors.orange}
            />
          </Kb.Box2>
          <Bio username={props.username} />
          <Kb.Box2 direction="vertical" fullWidth={true} style={styles.assertions}>
            {assertions}
          </Kb.Box2>
          {buttons.length && (
            <Kb.Box2 fullWidth={true} direction="vertical" style={styles.spaceUnderButtons} />
          )}
        </Kb.Box2>
      </Kb.ScrollView>
      {buttons.length && (
        <Kb.Box2 gap="small" centerChildren={true} direction="horizontal" style={styles.buttons}>
          {buttons}
        </Kb.Box2>
      )}
    </Kb.Box2>
  )
}

const avatarSize = 96
const barHeight = 62
const reason = {
  alignSelf: 'center',
  color: Styles.globalColors.white,
  flexShrink: 0,
  paddingBottom: Styles.globalMargins.small,
  paddingLeft: Styles.globalMargins.medium,
  paddingRight: Styles.globalMargins.medium,
  paddingTop: Styles.globalMargins.small,
  textAlign: 'center',
}

const styles = Styles.styleSheetCreate({
  assertions: {
    backgroundColor: Styles.globalColors.white,
    flexShrink: 0,
    paddingLeft: Styles.globalMargins.small,
    paddingRight: Styles.globalMargins.small,
    paddingTop: Styles.globalMargins.small,
  },
  avatarBackground: {
    backgroundColor: Styles.globalColors.white,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: avatarSize / 2,
  },
  avatarContainer: {flexShrink: 0, position: 'relative'},
  buttons: Styles.platformStyles({
    common: {
      ...Styles.globalStyles.fillAbsolute,
      backgroundColor: Styles.globalColors.white_90,
      flexShrink: 0,
      height: barHeight,
      position: 'absolute',
      top: undefined,
    },
    isElectron: {boxShadow: 'rgba(0, 0, 0, 0.15) 0px 0px 3px'},
  }),
  chatIcon: {marginRight: Styles.globalMargins.tiny},
  container: {
    backgroundColor: Styles.globalColors.white,
    position: 'relative',
  },
  reason: {
    ...reason,
    ...Styles.globalStyles.fillAbsolute,
    bottom: undefined,
    paddingBottom: avatarSize / 2,
  },
  reasonInvisible: {
    ...reason,
    opacity: 0,
  },
  scrollView: {...Styles.globalStyles.fillAbsolute},
  spaceUnderButtons: {
    flexShrink: 0,
    height: barHeight,
  },
})

export default Tracker
