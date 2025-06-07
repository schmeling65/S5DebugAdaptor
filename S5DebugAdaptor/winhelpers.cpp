#include "pch.h"
#include "winhelpers.h"
#include <cstdlib>

#include <commdlg.h>

void debug_lua::ProcessBasicWindowEvents()
{
	MSG msg;
	while (PeekMessageA(&msg, 0, 0, WM_CHARTOITEM, PM_REMOVE)) {
		if (msg.message == WM_QUIT)
			std::exit(0);
		TranslateMessage(&msg);
		DispatchMessageA(&msg);
	}
	while (PeekMessageA(&msg, 0, WM_NCCREATE, WM_NCMBUTTONDBLCLK, PM_REMOVE)) {
		if (msg.message == WM_QUIT)
			std::exit(0);
		TranslateMessage(&msg);
		DispatchMessageA(&msg);
	}
}

bool debug_lua::FileDialog::Show()
{
	OPENFILENAME op;

	std::memset(&op, 0, sizeof(OPENFILENAME));
	op.lStructSize = sizeof(OPENFILENAME);
	SelectedPath.resize(MAX_PATH);
	op.lpstrFile = SelectedPath.data();
	op.nMaxFile = SelectedPath.size();
	op.Flags = OFN_EXPLORER | OFN_PATHMUSTEXIST | OFN_HIDEREADONLY | OFN_OVERWRITEPROMPT;
	op.lpstrFilter = Filter;
	op.lpstrTitle = Title;
	return GetOpenFileName(&op);
}
