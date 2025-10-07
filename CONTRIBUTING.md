## Contributing to PingWatch 📡

🎉 First off, thank you for considering contributing to PingWatch! 

We're excited to have you join our community.
It's people like you that make open source such an amazing ecosystem.

This guide will help you get started contributing to PingWatch. We're committed to fostering a welcoming and collaborative environment.

## Table of Contents

- [Code of Conduct](#code-of-conduct)

- [How Can I Contribute?](#how-can-i-contribute)

    - [Reporting Bugs.](#reporting-bugs)

    - [Suggesting Enhancements.](#suggesting-enhancements)

    - [Your First Contribution.](#your-first-contribution)

- [Development Setup.](#development-setup)

- [Pull Request Process.](#pull-request-process)

- [Code Standards.](#code-standards)

- [Recognition.](#recognition)


## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Bugs are tracked as GitHub issues. Before creating a new issue:

- Check existing issues to see if the problem has already been reported.

- Use the bug report template if available.

- Include detailed information:

    - Operating system and version.

    - Steps to reproduce the issue.

    - Expected vs actual behavior.

    - Any relevant logs or screenshots.


### Suggesting Enhancements

We love ideas that make PingWatch better! When suggesting enhancements:

- Use the feature request template if available.

- Explain the use case and value it provides.

- Include examples if possible.

- Consider whether it aligns with PingWatch's scope.

### Your First Contribution

Unsure where to begin? Look for issues tagged good-first-issue or help-wanted. You can also:

- Improve documentation - always valuable!

- Fix typos in code or documentation.

- Add tests to improve coverage

- Optimize performance - like the Alpine optimization that reduced image size by 68%! 🚀

## Development Setup

Getting your development environment ready:

### Local Development

```bash
# Fork and clone the repository
git clone https://github.com/tsotetsi/pingwatch.git
cd pingwatch

```
<i>See [README.md]() file for more details.</i>


### Building with Docker

We use multi-stage Docker builds. Test your changes with:
```bash
# Build the development image.
docker build -t pingwatch:dev .

# Test the built image.
docker run -it pingwatch:dev
```

### Testing

```bash
# Add your test commands here once available.
```

## Pull Request Process

We love PRs! Here's how to make them great:

- Fork the repository.

- Create a feature branch (`git checkout -b <type>-<issue_number#>-<amazing-feature-name>`).

- Make your changes.

- Commit with clear messages (`git commit -m '<type>[Optional scope]: <description>'`).

- Availeble types: `feat, fix, docs, style, refactor, perf, test, chore, build, ci` etc.

- Open an issues on github if minimal neccesary details.

- Rename you branch, with a prefix, using the issue number from above.(`git branch -m <type>-<issue_number>-amazing-feature-name`).

- Push to your branch (`git push origin <type>-<issue_number>-amazing-feature-name`).

- Open a Pull Request. PR's would be reviewed withing 8 hours.

**PR Guidelines**

- Describe what and why - Explain what your PR does and why it's needed.

- Reference issues - Link to any related issues.

- Keep it focused - One feature/fix per PR is ideal.

- Test your changes - Ensure everything works as expected.

- Update documentation - If you change functionality, update the docs.

- We'll review your PR promptly and help you get it merge-ready! We welcome all contributions and believe in working collaboratively.

## Code Standards**

To maintain code quality and consistency:

- Follow existing style - Match the code style you see in the codebase.

- Write clear commit messages - Use the imperative mood ("Add feature" not "Added feature").

- Comment complex logic - Help others understand your reasoning.

- Keep it simple - Simple, maintainable code is better than clever, complex code.

- Consider performance - Especially important for a monitoring tool like PingWatch(Background task and battery drain).

## Recognition

We believe in giving credit where it's due! All contributors get recognition through:

- Contributors list in our README.

- Shout-outs in release notes.

- Direct thanks in merged PRs.

Great contributions like the use of python alpine image for optimization that reduced our image size by 68%
are exactly what we love to see! Your work makes a real difference.

**Questions?**

Don't hesitate to:

- Open an issue with your question(s).

- Reach out to the maintainer(s) directly.

- Ask for help in your PR - we're here to support you!

- Thank you for contributing to PingWatch! Together, we're building something amazing. ✨