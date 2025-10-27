# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi


# User specific environment
if ! [[ "$PATH" =~ "$HOME/.local/bin:$HOME/bin:" ]]
then
    PATH="$HOME/.local/bin:$HOME/bin:$PATH"
fi
export PATH

# Uncomment the following line if you don't like systemctl's auto-paging feature:
# export SYSTEMD_PAGER=

icon1=󰌽
icon2=

BG="\[\e[48;"
FG="\[\e[38;"
BASE2="2;238;232;213m\]"
COLOR="2;108;113;196m"

PS1="$BG\$COLOR\]$FG$BASE2 $icon1  \w $BG\$COLOR\[\e[0m\]$FG\$COLOR\]$icon2 $icon2\[\e[0m\] "

alias ls="ls -a --color=auto"
alias ll="ls -al --color=auto"
alias v="vim"
alias beroot="sudo -E su -p"

export CGO_ENABLED=0
export HISTSIZE=25000
export HISTFILESIZE=25000
export HISTCONTROL=ignoreboth
export EDITOR=vim

# fnm
export PATH=/home/sp_admin/.local/share/fnm:$PATH
eval "`fnm env`"




