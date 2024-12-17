#!/bin/sh

# Define regex for branch types
feature_branch_regex="^feature\/.+$"                                       # Matches with feature/blabla
bugfix_branch_regex="^bugfix\/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)-.+$" # Matches with bugfix/1.1.1-blabla
hotfix_branch_regex="^hotfix\/.+$"                                         # Matches with hotfix/blabla
release_branch_regex="^release\/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$" # Matches with release/1.1.1-blabla
restricted_branches_regex="^(main|dev|release\/.+)$"

is_push_allowed() {
    local branch_name=$1
    local base_branch
    check_branch_naming_convention "$branch_name"
    find_base_branch
    can_branch_push
}

check_branch_naming_convention() {
    # Get the current branch name.
    branch_name=$1
    if ! echo "$branch_name" | grep -Eq "($feature_branch_regex|$bugfix_branch_regex|$hotfix_branch_regex|$release_branch_regex|$restricted_branches_regex)"; then
        echo "Error: Unsupported branch name pattern -> "$branch_name"." >&2
        echo "Please ensure your branch follows the naming conventions." >&2
        echo "Compatible regex patterns -> (feature/.+, bugfix/x.y.z-+, hotfix/.+)" >&2
        echo "Where x,y,z are numbers that matches with its release branch version." >&2
        echo "You cannot create main, dev and release/x.y.z branch from local, must done in GitHub UI." >&2
        exit 1
    fi
}

find_base_branch() {
    # Determine source branch based on current branch type.
    if echo "$branch_name" | grep -Eq "$feature_branch_regex"; then
        base_branch="dev"
    elif echo "$branch_name" | grep -Eq "$bugfix_branch_regex"; then
        base_branch="release/$(echo "$branch_name" | grep -Eo "(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)")" # Bugfix branches should based on its release branch version.
    elif echo "$branch_name" | grep -Eq "$hotfix_branch_regex"; then
        base_branch="main" # Hotfix branches are based on main.
    elif echo "$branch_name" | grep -Eq "$restricted_branches_regex"; then
        echo "Error: Restricted action on protected branches (main,dev and release/x.y.z)." >&2
        exit 1
    fi

    # Check if the base branch exist on remote.
    if ! git show-ref --verify --quiet "refs/remotes/origin/$base_branch"; then
        echo "Error: Base branch '$base_branch' must exist on remote." >&2
        echo "If your branch is bugfix, related release branch version must on remote." >&2
        exit 1
    fi

    echo "Found base branch is $base_branch."
}

can_branch_push() {
    # Check current branch is up to date with remote.
    check_sync_status "$branch_name"

    # Check current branch is up to date with base on the remote.
    check_sync_status "$branch_name" "$base_branch"
}

check_sync_status() {
    local local_branch=$1
    local remote_target_branch=$2
    
    # Default remote target branch is the same as local branch.
    if [ -z "$remote_target_branch" ]; then
        # If no argument given target branch is remote of current branch.
        remote_target_branch="origin/$local_branch"

        # Check if the target(current) branch is newly created on remote.
        if ! git show-ref --verify --quiet "refs/remotes/$remote_target_branch"; then
            # Push is approved, just be sync with base branch.
            exit 0
        fi
    else
        # If argument given target branch is remote of base branch.
        remote_target_branch="origin/$remote_target_branch"
    fi

    # Determine latest common commit and the latest commits.
    merge_base=$(git merge-base "$local_branch" "$remote_target_branch")
    local_commit=$(git rev-parse "$local_branch")
    remote_commit=$(git rev-parse "$remote_target_branch")

    # Check if the branch is up-to-date or already merged.
    if [ "$local_commit" = "$remote_commit" ]; then
        echo "Your branch '$local_branch' is up to date with '$remote_target_branch'."

    # Check if the branch is behind the base branch.
    elif [ "$local_commit" = "$merge_base" ]; then
        echo "Error: Your branch '$local_branch' is behind '$remote_target_branch'. Please pull or merge '$remote_target_branch' to update '$local_branch'." >&2
        exit 1

    # Check if the branch is ahead of the base branch.
    elif [ "$remote_commit" = "$merge_base" ]; then
        echo "Your branch '$local_branch' is ahead of '$remote_target_branch'. OK."

    # Branches have diverged and need merging.
    else
        echo "Error: Your branch '$local_branch' and '$remote_target_branch' have diverged. Please pull or merge '$remote_target_branch' to resolve differences." >&2
        exit 1
    fi
}



