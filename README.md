# release-exists-action
A GitHub action that determines if a release exists in a repo.

If a release is found it will additionally return information about it such as:
* Pre-release status
* Draft status
* Name
* Url

## Inputs

### `tag` 

**Required** - Tag to search a matching release for.

### `repo`

**Optional** - Repo you'd like to search, in `owner/repo-name` format.

## Outputs

### `exists`

A string value of 'true' or 'false'

### `prerelease`

A string value of 'true' or 'false'

### `draft`

A string value of 'true' or 'false'

### `name`

If found, the name of the release.

### `url`

If found, the url of the release.

## Example usages

To check if a release with the tag `v1.0` exists in your repo:
```yaml
- uses: mukunku/release-exists-action@v1.0.0
  id: check-release
  with: 
    tag: 'v1.0'

- run: echo "Release exists!"
  if: steps.check-release.outputs.exists == 'true' 
```

To check if a release with the tag [`v1.0.0`](https://github.com/actions/checkout/releases/tag/v1.0.0) exists in the repo `actions/checkout`:
```yaml
- uses: mukunku/release-exists-action@v1.0.0
  id: check-release
  with: 
    tag: 'v1.0.0'
    repo: 'actions/checkout'

- run: | 
    echo "Release exists and is not a draft!"
    echo steps.check-release.outputs.name 
    echo steps.check-release.outputs.url
    echo steps.check-release.outputs.prerelease
    echo steps.check-release.outputs.draft
  if: steps.check-release.outputs.exists == 'true' && steps.check-release.outputs.draft == 'false'
```

<hr>

This action uses the `${{github.token}}` secret to automatically inject your access token. If you'd like to provide your own token instead check out [this help article](https://github.com/mukunku/release-exists-action/wiki/Setting-the-GITHUB_TOKEN-explicitly).
