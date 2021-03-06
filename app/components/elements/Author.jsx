/* eslint react/prop-types: 0 */
import React from 'react';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate'
import {LinkWithDropdown} from 'react-foundation-components/lib/global/dropdown'
import Follow from 'app/components/elements/Follow';
import Icon from 'app/components/elements/Icon';
import { Link } from 'react-router';
import {authorNameAndRep} from 'app/utils/ComponentFormatters';
import Reputation from 'app/components/elements/Reputation';
import { translate } from 'app/Translator';

const {string, bool, number} = React.PropTypes

class Author extends React.Component {
    static propTypes = {
        author: string.isRequired,
        follow: bool,
        mute: bool,
        authorRepLog10: number,
    }
    static defaultProps = {
        follow: true,
        mute: true,
    }
    shouldComponentUpdate = shouldComponentUpdate(this, 'Author')

    trackAnalytics = eventType => {
        console.log(eventType)
        analytics.track(eventType)
    }

    render() {
        const {author, follow, mute, authorRepLog10} = this.props // html
        const {username} = this.props // redux

        const author_link = <span className="Author" itemProp="author" itemScope itemType="http://schema.org/Person">
            <Link to={'/@' + author}><strong>{author}</strong></Link><Reputation value={authorRepLog10} />
        </span>

        if(!username)
            return author_link

        const dropdown = <div className="Author__dropdown">
            <Link to={'/@' + author}>{translate('profile')}</Link> &nbsp;
            <Follow className="float-right" follower={username} following={author} what="blog"
                    showFollow={follow} showMute={mute} />
        </div>

        return (
            <span className="Author">
                <LinkWithDropdown
                    closeOnClickOutside
                    dropdownPosition="bottom"
                    dropdownAlignment="center"
                    dropdownContent={dropdown}
                    onClick={this.trackAnalytics.bind(this, 'author dropdown clicked')}
                >
                    <span className="FoundationDropdownMenu__label">
                        <span itemProp="author" itemScope itemType="http://schema.org/Person">
                            <strong>{author}</strong>
                        </span>
                        <Icon name="dropdown-arrow" />
                    </span>
                </LinkWithDropdown>
                <Reputation value={authorRepLog10} />
            </span>
        )
                // by <span itemProp="author" itemScope itemType="http://schema.org/Person"><Link
                //    to={author_link}>{content.author}</Link></span>
    }
}

import {connect} from 'react-redux'
export default connect(
    (state, ownProps) => {
        const current = state.user.get('current')
        const username = current && current.get('username')
        return {
            ...ownProps,
            username,
        }
    },
    // dispatch => ({
    //     vote: (abc) => {
    //         dispatch(transaction.actions.broadcastOperation({
    //             abc
    //         }))
    //     },
    // })
)(Author)
