# Code Review stage of the interview

To make code review we clone repository, create PR between two branches and invite candidate to review this PR.
This can be done by executing:

```bash
npx interview-pr curatorname -o prjctr-webapp -r curator -u silentimp -p ghp_aqwZtkTrJUhdkUjdP7uTFbeFvw3jylom
```
where: 
- `curatorname` – GitHub login of the candidate, 
- `-u` - GitHub login of the user from which name we are using GitHub API
- `-p` - token that we are using with GitHub API
- `-o` - organization name
- `-r` - repository name

```bash
npx interview-pr curatorname -r curator-code-review -f homework -t main -o prjctr-webapp -u silentimp -p ghp_aqwZtkTrJUhdkUjdP7uTFbeFvw3jylom
```
where: 
- `curatorname` – GitHub login of the candidate, 
- `-u` - GitHub login of the user from which name we are using GitHub API
- `-p` - token that we are using with GitHub API
- `-o` - organization name
- `-r` - repository name
- `-f` - from which branch to make PR
- `-t` - to which branch to make PR
