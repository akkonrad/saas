# Claude Code Hooks Configuration

This document explains how to configure automatic Angular code reviews using Claude Code hooks.

## Overview

**Goal**: Automatically trigger the `/ng-review` skill whenever Angular files are modified.

**Approach**: Use a `PostToolUse` hook with a prompt-based trigger that instructs Claude to run the Angular review skill after editing Angular files.

## Setup Instructions

### Option 1: Prompt-Based Hook (Recommended)

This approach uses Claude's intelligence to determine when to trigger reviews.

#### 1. Add to `.claude/settings.json`

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "You just modified a file. Determine if it's an Angular file (component, service, guard, or template in apps/*/web/, apps/*/landing/, or libs/web/). If yes, immediately invoke the 'ng-review' skill to review the changes. Respond with {\"decision\": \"allow\", \"feedback\": \"[your action]\" }",
            "timeout": 10
          }
        ]
      }
    ]
  },
  "permissions": {
    "allow": [
      "Bash(npx nx show:*)",
      "Bash(test:*)",
      "Bash(mkdir:*)",
      "Bash(yarn add:*)",
      "Bash(npx nx generate:*)",
      "Bash(yarn nx show:*)",
      "Bash(yarn nx build:*)",
      "Bash(yarn remove:*)",
      "Bash(yarn nx serve:*)",
      "Bash(npx nx lint:*)",
      "Bash(cat:*)",
      "Bash(npx nx build:*)",
      "Bash(find:*)",
      "Bash(ls:*)",
      "Bash(npx nx run:*)",
      "Bash(npx tsc:*)",
      "Bash(tree:*)",
      "Bash(npx nx test:*)",
      "WebSearch",
      "Bash(lsof:*)",
      "Bash(xargs kill:*)",
      "Bash(npx nx storybook:*)",
      "WebFetch(domain:nx.dev)",
      "Bash(npx nx list:*)",
      "Bash(npx nx serve:*)"
    ]
  }
}
```

#### 2. Test the Hook

```bash
# Verify hooks are registered
claude /hooks

# Make a change to an Angular file to test
# The hook should automatically trigger the ng-review skill
```

### Option 2: Command-Based Hook (More Control)

This approach uses a shell script for precise file detection.

#### 1. Create Hook Script

Create `.claude/hooks/angular-review.sh`:

```bash
#!/bin/bash
set -e

# Read hook input from stdin
input=$(cat)

# Extract the file path from the JSON input
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# Exit if no file path
if [ -z "$file_path" ]; then
  exit 0
fi

# Check if it's an Angular file in the right directories
if echo "$file_path" | grep -qE '(apps/[^/]+/(web|landing)/|libs/web/).*\.(ts|html)$'; then
  # Check if it's a component, service, guard, directive, pipe, or template
  if echo "$file_path" | grep -qE '\.(component|service|guard|directive|pipe|spec)\.ts$|\.html$'; then
    echo "🔍 Angular file detected: $file_path"
    echo "📝 Reminder: Run /ng-review to check this file against Angular best practices"
  fi
fi

exit 0
```

Make it executable:

```bash
chmod +x .claude/hooks/angular-review.sh
```

#### 2. Add to `.claude/settings.json`

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/angular-review.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

## How It Works

1. **File Modified**: When you use `Edit` or `Write` tools on a file
2. **Hook Triggers**: The `PostToolUse` hook executes after the file is saved
3. **Detection**:
   - **Option 1**: Claude evaluates if it's an Angular file and runs `/ng-review` skill
   - **Option 2**: Shell script checks file path/extension and reminds Claude
4. **Review**: The `/ng-review` skill checks the file against Angular best practices
5. **Feedback**: You receive actionable feedback on violations

## Angular File Detection

The hooks detect these file types in Angular directories:
- `*.component.ts` - Components
- `*.service.ts` - Services
- `*.guard.ts` - Route guards
- `*.directive.ts` - Directives
- `*.pipe.ts` - Pipes
- `*.html` - Templates
- `*.spec.ts` - Unit tests (in Angular apps/libs)

In these locations:
- `apps/faceless/web/**`
- `apps/faceless/landing/**`
- `libs/web/**`

## Hook Configuration Reference

### Available Event Types
- `PostToolUse` - After tool execution (used for file change detection)
- `PreToolUse` - Before tool execution (can block tools)
- `UserPromptSubmit` - After user submits a message
- `Stop` - When Claude finishes responding
- `SessionStart` - When session starts

### Hook Decision Responses

Hooks must return JSON with:
```json
{
  "decision": "allow" | "block",
  "feedback": "Message to Claude",
  "reason": "Optional explanation"
}
```

- `allow` - Continue normally
- `block` - Stop the action (for PreToolUse hooks)

### Environment Variables

Available in command hooks:
- `$CLAUDE_PROJECT_DIR` - Project root directory
- All standard shell environment variables

## Troubleshooting

### Hook Not Triggering
```bash
# Check if hooks are registered
claude /hooks

# Verify hook syntax
cat .claude/settings.json | jq '.hooks'

# Check hook script permissions (Option 2)
ls -l .claude/hooks/angular-review.sh
```

### Review Skill Not Running
- Ensure `/ng-review` skill exists in `.claude/skills/`
- Check skill syntax: `cat .claude/skills/ng-review.skill.md`
- Verify the prompt instructs Claude to invoke the skill

### Performance Issues
- Reduce hook timeout if it's too long
- Use command-based hooks for faster detection
- Limit pattern matching scope

## Best Practices

1. **Use Project Settings**: Store hooks in `.claude/settings.json` (committed) for team consistency
2. **Test Manually First**: Run hook scripts manually before adding to settings
3. **Set Appropriate Timeouts**: Angular reviews may need 10-30 seconds
4. **Graceful Failures**: Always exit with code 0 to avoid blocking Claude
5. **Clear Feedback**: Provide actionable messages in hook responses

## Advanced Configuration

### Review Specific File Types Only

Modify the hook to only review components:

```bash
# In angular-review.sh
if echo "$file_path" | grep -qE '\.component\.ts$'; then
  # Only review components
fi
```

### Disable for Specific Paths

Skip reviews for test files:

```bash
# Skip spec files
if echo "$file_path" | grep -qE '\.spec\.ts$'; then
  exit 0
fi
```

### Multiple Hooks

You can chain multiple hooks:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "prompt", "prompt": "..." },
          { "type": "command", "command": "..." }
        ]
      }
    ]
  }
}
```

## References

- [Claude Code Hooks Guide](https://code.claude.com/docs/en/hooks-guide.md)
- [Hooks Reference](https://code.claude.com/docs/en/hooks.md)
- [Settings Documentation](https://code.claude.com/docs/en/settings.md)
